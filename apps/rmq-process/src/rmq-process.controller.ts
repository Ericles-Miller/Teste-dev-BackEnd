import { Controller } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @MessagePattern('test-rmq')
  async getHello(@Payload() data: number[], @Ctx() context: RmqContext) {
    return this.rmqProcessService.getHello(data, context);
  }
}
