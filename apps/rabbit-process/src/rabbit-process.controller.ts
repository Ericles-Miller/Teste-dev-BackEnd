import { Controller } from '@nestjs/common';
import { RabbitProcessService } from './rabbit-process.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RabbitProcessController {
  constructor(private readonly rabbitProcessService: RabbitProcessService) {}

  @EventPattern('save-data')
  async saveDataInQueue(
    @Payload() data: { batch: string[]; id: string },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('test');

    await this.rabbitProcessService.processData(data);

    channel.ack(originalMsg);
  }
}
