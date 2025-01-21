import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitProcessModule } from './rabbit-process.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RabbitProcessModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'file-process',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.init();
  console.log('Rabbit-Mq service is listen!');
}

bootstrap();
