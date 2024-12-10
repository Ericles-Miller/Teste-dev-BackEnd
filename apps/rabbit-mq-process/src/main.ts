import { NestFactory } from '@nestjs/core';
import { RabbitMqProcessModule } from './rabbit-mq-process.module';

async function bootstrap() {
  const app = await NestFactory.create(RabbitMqProcessModule);
  await app.listen(3333);
}
bootstrap();
