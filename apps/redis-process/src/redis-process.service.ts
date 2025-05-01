import { Injectable } from '@nestjs/common/decorators/core';
import { MessagePattern } from '@nestjs/microservices';
import { SetStatusDto } from 'apps/api/src/redis/set-status.dto';
import Redis from 'ioredis';

@Injectable()
export class RedisProcessService {
  constructor(public readonly redis: Redis) {}

  @MessagePattern('set-status')
  async setStatus({ jobId, status }: SetStatusDto): Promise<void> {
    await this.redis.set(jobId, status, 'EX', 3600);
  }

  @MessagePattern('get-status')
  async getStatus(jobId: string): Promise<string | null> {
    return await this.redis.get(jobId);
  }
}
