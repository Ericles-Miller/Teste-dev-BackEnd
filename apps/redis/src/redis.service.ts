import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { SetStatusDto } from 'apps/challenge-flow/src/redis/Dtos/Set-status.dto';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(public readonly redis: Redis) {}

  @MessagePattern('set-status')
  async setStatus(@Payload() data: SetStatusDto, @Ctx() context: RedisContext): Promise<void> {
    await this.redis.set(data.jobId, data.status, 'EX', 3600);
  }

  @MessagePattern('get-status')
  async getStatus(jobId: string): Promise<string | null> {
    return await this.redis.get(jobId);
  }
}
