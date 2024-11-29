import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMqModule } from './rabbit-mq.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RabbitMqModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}
bootstrap();
