import { Module } from '@nestjs/common';
import { ManagerFileController } from './manager-file.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { ManagerFileService } from './manager-file.service';
import { AwsModule } from '../aws/aws.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RabbitmqModule, AwsModule, RedisModule],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
