import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class TestService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  findAll() {
    this.rabbitmqService.instance.emit('test-rmq', { message: 'test send message' }); // envia para o consumer
    this.rabbitmqService.instance.send('', {}).pipe(); //recupera as infos
  }
}
