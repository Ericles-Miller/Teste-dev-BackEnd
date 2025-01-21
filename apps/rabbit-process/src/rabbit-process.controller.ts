import { Controller } from '@nestjs/common';
import { RabbitProcessService } from './rabbit-process.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitProcessController {
  constructor(private readonly rabbitProcessService: RabbitProcessService) {}

  @EventPattern('*')
  async saveDataInQueue(@Payload() data: { batch: string[]; id: string }): Promise<void> {
    await this.rabbitProcessService.processData(data);
  }
}
