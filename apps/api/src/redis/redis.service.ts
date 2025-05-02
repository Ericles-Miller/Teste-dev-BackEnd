import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly redisConfig: RedisConfig) {}

  async onModuleInit() {
    console.log('Redis Service initialized');
  }

  async onModuleDestroy() {
    await this.redisConfig.disconnect();
    console.log('Redis Service destroyed');
  }

  async publish(key: string, value: any, expirationTime?: number): Promise<void> {
    return this.redisConfig.publish(key, value, expirationTime);
  }

  async get(key: string): Promise<any> {
    return this.redisConfig.get(key);
  }
}
