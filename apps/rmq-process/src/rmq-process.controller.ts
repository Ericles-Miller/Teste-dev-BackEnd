import { Controller } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProcessFileDto } from 'apps/api/src/rabbitmq/dtos/process-file.dto';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @MessagePattern('file-upload-queue')
  async uploadFile(@Payload() data: ProcessFileDto, @Ctx() context: RmqContext) {
    return this.rmqProcessService.uploadFile(data, context);
  }
}
