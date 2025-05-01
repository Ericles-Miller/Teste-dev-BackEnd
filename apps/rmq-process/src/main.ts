import { NestFactory } from '@nestjs/core';
import { RmqProcessModule } from './rmq-process.module';

async function bootstrap() {
  const app = await NestFactory.create(RmqProcessModule);

  await app.listen(3334, () => console.log('Rabbitmq service'));
}

bootstrap().catch(() => {
  process.exit(1);
});
