import { forwardRef, Module } from '@nestjs/common';
import { ManagerFileService } from './manager-file.service';
import { ManagerFileController } from './manager-file.controller';
import { RedisModule } from '../redis/redis.module';
import { AwsModule } from '../aws/aws.module';
import { RedisProcessModule } from 'apps/redis-process/src/redis-process.module';

@Module({
  imports: [RedisModule, AwsModule, forwardRef(() => RedisProcessModule)],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
