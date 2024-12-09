import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
}
