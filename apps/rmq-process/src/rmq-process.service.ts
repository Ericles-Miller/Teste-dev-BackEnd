import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqProcessService {
  async getHello(data: any, context: RmqContext) {
    console.log(data);

    const chanel = context.getChannelRef();
    const originalMSg = context.getMessage();

    chanel.ack(originalMSg);
  }
}
