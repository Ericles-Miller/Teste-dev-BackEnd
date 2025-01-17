import { Controller } from '@nestjs/common';
import { RedisProcessService } from './redis-process.service';
import { Ctx, EventPattern, Payload, RedisContext } from '@nestjs/microservices';
import { StatusProcessDto } from '../dtos/status-process.dto';

@Controller('Redis-process')
export class RedisProcessController {
  constructor(private readonly redisProcessService: RedisProcessService) {}

  @EventPattern('set-status')
  async setStatus(@Payload() data: StatusProcessDto, @Ctx() context: RedisContext): Promise<void> {
    console.log(`Channel: ${context.getChannel()}`);

    await this.redisProcessService.saveStatusProcessFile(data);
  }
}
