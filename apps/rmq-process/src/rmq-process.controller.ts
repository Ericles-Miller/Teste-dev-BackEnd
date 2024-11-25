import { Controller } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @MessagePattern('file-upload-queue')
  async uploadFile(@Payload() data: number[], @Ctx() context: RmqContext) {
    return this.rmqProcessService.uploadFile(data, context);
  }
}
