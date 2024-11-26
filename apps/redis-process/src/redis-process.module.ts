import { Module } from '@nestjs/common';
import { RedisModule } from '@api/redis/redis.module';
import { RedisProcessService } from './redis-process.service';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [RedisProcessService],
  exports: [RedisProcessService],
})
export class RedisProcessModule {}
