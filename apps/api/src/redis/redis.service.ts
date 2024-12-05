import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_SERVICE')
    public readonly instance: ClientRedis,
  ) {}
}
