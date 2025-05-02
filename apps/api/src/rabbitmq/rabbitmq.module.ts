import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitmqModule {}
