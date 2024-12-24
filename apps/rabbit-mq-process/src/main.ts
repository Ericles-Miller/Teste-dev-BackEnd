import { NestFactory } from '@nestjs/core';
import { RabbitMqProcessModule } from './rabbit-mq-process.module';
import { fork } from 'child_process';
import * as os from 'os';
import * as net from 'net';

const numCPUs = os.cpus().length;
const BASE_PORT = 3333;
const MAX_PORT = 3400;

async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (port <= MAX_PORT) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error('Nenhuma porta disponível');
}

async function bootstrap() {
  const app = await NestFactory.create(RabbitMqProcessModule);
  const workerId = process.env.WORKER_ID ? parseInt(process.env.WORKER_ID) : 0;

  try {
    const port = await findAvailablePort(BASE_PORT + workerId);
    await app.listen(port);
    console.log(`Worker ${process.env.WORKER_ID} iniciado na porta ${port}`);
  } catch (error) {
    console.error(`Erro ao iniciar worker ${workerId}:`, error);
    process.exit(1);
  }
}

if (process.env.IS_CHILD) {
  bootstrap();
} else {
  console.log(`Processo principal iniciado: ${process.pid}`);
  const workers = new Map();
  const activeWorkers = new Set();

  const startWorker = async (i: number) => {
    if (activeWorkers.has(i)) return;

    const worker = fork(__filename, [], {
      env: { ...process.env, IS_CHILD: 'true', WORKER_ID: i.toString() },
    });

    workers.set(i, worker);
    activeWorkers.add(i);

    worker.on('exit', (code) => {
      console.log(`Worker ${i} finalizado com código ${code}`);
      activeWorkers.delete(i);

      if (code !== 0) {
        setTimeout(() => startWorker(i), 1000);
      }
    });
  };

  for (let i = 0; i < numCPUs; i++) {
    startWorker(i);
  }

  process.on('SIGTERM', () => {
    workers.forEach((worker) => worker.kill());
    process.exit(0);
  });
}
