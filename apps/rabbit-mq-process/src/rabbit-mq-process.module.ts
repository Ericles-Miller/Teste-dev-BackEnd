import { Module } from '@nestjs/common';
import { RabbitMqProcessController } from './rabbit-mq-process.controller';
import { RabbitMqProcessService } from './rabbit-mq-process.service';

@Module({
  imports: [],
  controllers: [RabbitMqProcessController],
  providers: [RabbitMqProcessService],
})
export class RabbitMqProcessModule {}
