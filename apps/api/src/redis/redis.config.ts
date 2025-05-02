import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfig {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      db: Number(process.env.REDIS_DB) || 0,
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  async publish(key: string, value: any, expirationTime?: number): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      if (expirationTime) {
        await this.redisClient.setex(key, expirationTime, stringValue);
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (error) {
      console.error('Error publishing to Redis:', error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error getting from Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.redisClient.quit();
  }
}
