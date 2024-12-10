import { Module } from '@nestjs/common';
import { ManagerFileService } from './manager-file.service';
import { ManagerFileController } from './manager-file.controller';
import { RedisModule } from '../redis/redis.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [RedisModule, AwsModule],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
