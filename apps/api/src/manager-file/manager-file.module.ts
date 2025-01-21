import { Module } from '@nestjs/common';
import { ManagerFileService } from './manager-file.service';
import { ManagerFileController } from './manager-file.controller';
import { RedisModule } from '../redis/redis.module';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RedisModule, RabbitMqModule],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
