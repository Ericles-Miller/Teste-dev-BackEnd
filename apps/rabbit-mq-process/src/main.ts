import { NestFactory } from '@nestjs/core';
import { RabbitMqProcessModule } from './rabbit-mq-process.module';
import { fork } from 'child_process';
import * as os from 'os';

const numCPUs = os.cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(RabbitMqProcessModule);

  const port = 3333 + (process.env.WORKER_ID ? parseInt(process.env.WORKER_ID) : 0);
  await app.listen(port);

  console.log(`Worker process ${process.pid} is running on port ${port}`);
}

if (process.env.IS_CHILD) {
  bootstrap();
} else {
  console.log(`Master process started on ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    const worker = fork(__filename, [], {
      env: { ...process.env, IS_CHILD: 'true', WORKER_ID: i.toString() },
    });

    worker.on('exit', () => {
      console.log(`Worker process ${worker.pid} exited. Restarting...`);
      fork(__filename, [], {
        env: { ...process.env, IS_CHILD: 'true', WORKER_ID: i.toString() },
      });
    });
  }
}
