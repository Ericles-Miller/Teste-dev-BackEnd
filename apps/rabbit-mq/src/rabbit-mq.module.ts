import { Module } from '@nestjs/common';
import { RabbitMqController } from './rabbit-mq.controller';
import { RabbitMqService } from './rabbit-mq.service';
import { UserModule } from 'apps/challenge-flow/src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
