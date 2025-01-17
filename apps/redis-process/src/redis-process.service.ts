import { Inject, Injectable } from '@nestjs/common';
import { StatusProcessDto } from '../dtos/status-process.dto';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class RedisProcessService {
  constructor(
    @Inject('REDIS_PROCESS_SERVICE')
    public readonly redisClient: ClientRedis,
  ) {}

  async checkStatusProcessFile(key: string): Promise<any> {
    const status = await this.redisClient.getRequestPattern(key);
    return JSON.parse(status);
  }

  async saveStatusProcessFile(data: StatusProcessDto): Promise<void> {
    await this.redisClient.send(data.key, JSON.stringify(data));
  }
}
