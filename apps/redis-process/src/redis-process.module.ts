import { Module } from '@nestjs/common';
import { RedisProcessService } from './redis-process.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RedisProcessService],
  exports: [RedisProcessService],
})
export class RedisProcessModule {}
