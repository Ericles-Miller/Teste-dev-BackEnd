import { NestFactory } from '@nestjs/core';
import { RedisProcessModule } from './redis-process.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RedisProcessModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  app.init();
  console.log('Redis microservice is listening...');
}

bootstrap();
