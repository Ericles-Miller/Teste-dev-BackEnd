import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  controllers: [RedisController],
  providers: [RedisService, Redis],
  exports: [RedisService],
})
export class RedisModule {}
