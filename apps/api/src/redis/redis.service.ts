import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  constructor() {} //   public instance: ClientRedis, //   @Inject('REDIS_SERVICE')
}
