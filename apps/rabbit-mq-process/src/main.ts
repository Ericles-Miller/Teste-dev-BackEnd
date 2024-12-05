import { NestFactory } from '@nestjs/core';
import { RabbitMqProcessModule } from './rabbit-mq-process.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RabbitMqProcessModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap();
