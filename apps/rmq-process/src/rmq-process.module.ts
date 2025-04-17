import { Module } from '@nestjs/common';
import { RabbitMqService } from 'apps/api/src/rabbitmq/rabbitmq.service';
import { UsersModule } from 'apps/api/src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [RabbitMqService],
})
export class RmqProcessModule {}
