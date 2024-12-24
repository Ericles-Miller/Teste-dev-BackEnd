import { NestFactory } from '@nestjs/core';
import { RabbitMqProcessModule } from './rabbit-mq-process.module';
import { fork, ChildProcess } from 'child_process';
import * as os from 'os';

const MIN_WORKERS = Math.max(4, os.cpus().length);
const MAX_WORKERS = os.cpus().length * 2;
const BATCH_SIZE = 1000;
const workers = new Map<number, ChildProcess>();

async function bootstrap() {
  const app = await NestFactory.create(RabbitMqProcessModule, {
    logger: ['error', 'warn'],
  });

  process.setMaxListeners(MAX_WORKERS);

  process.on('message', async (msg) => {
    if (msg === 'shutdown') {
      await app.close();
      process.exit(0);
    }
  });

  const port = 3333 + (process.env.WORKER_ID ? parseInt(process.env.WORKER_ID) : 0);
  await app.listen(port);
}

function createWorker(workerId: number): ChildProcess {
  const worker = fork(__filename, [], {
    env: {
      ...process.env,
      IS_CHILD: 'true',
      WORKER_ID: workerId.toString(),
      NODE_OPTIONS: '--max-old-space-size=4096', // Aumenta heap
    },
  });

  // Comunicação otimizada
  worker.on('message', (message) => {
    if (message === 'ready') {
      worker.send({ type: 'start', batchSize: BATCH_SIZE });
    }
  });

  worker.on('exit', (code) => {
    workers.delete(workerId);
    if (code !== 0) {
      const newWorker = createWorker(workerId);
      workers.set(workerId, newWorker);
    }
  });

  return worker;
}

if (process.env.IS_CHILD) {
  bootstrap();
} else {
  // Pool dinâmico de workers
  const startWorkers = () => {
    const targetWorkers = Math.min(MAX_WORKERS, Math.max(MIN_WORKERS, Math.ceil(os.loadavg()[0] * 2)));

    while (workers.size < targetWorkers) {
      const workerId = workers.size;
      const worker = createWorker(workerId);
      workers.set(workerId, worker);
    }
  };

  // Monitoramento e ajuste automático
  setInterval(() => {
    const load = os.loadavg()[0];
    if (load < os.cpus().length * 0.8) {
      startWorkers();
    }
  }, 5000);

  // Inicialização inicial
  startWorkers();

  // Shutdown otimizado
  process.on('SIGTERM', () => {
    const promises = Array.from(workers.values()).map(
      (worker) =>
        new Promise((resolve) => {
          worker.send('shutdown');
          worker.on('exit', resolve);
        }),
    );

    Promise.all(promises).then(() => process.exit(0));
  });
}
