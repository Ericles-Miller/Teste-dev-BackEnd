import { NestFactory } from '@nestjs/core';
import { RmqProcessModule } from './rmq-process.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(RmqProcessModule);
    
    await app.listen(3334);
    logger.log('RabbitMQ Service está rodando na porta 3334');
  } catch (error) {
    console.error('Falha ao iniciar o RabbitMQ Service:', error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('Erro não tratado durante o bootstrap:', error);
  process.exit(1);
});
