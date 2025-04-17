import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RabbitMqConfig } from './rabbitmq.config';
import { SendToQueueProcessFileDto } from './dtos/send-to-queue-process-file.dto';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  constructor() {}

  async onModuleInit() {
    await RabbitMqConfig.connect();
  }

  async onModuleDestroy() {
    await RabbitMqConfig.closeConnection();
  }

  async sendToQueueProcessFile(userDto: SendToQueueProcessFileDto): Promise<boolean> {
    try {
      await RabbitMqConfig.publishMessage({
        routingKey: 'processFile',
        message: JSON.stringify(userDto),
        options: {
          persistent: true,
          queueName: 'processFile',
          durable: true,
        },
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async sendToQueueUploadFile({ message }: ProducerDto): Promise<boolean> {
  //   try {
  //     await RabbitMqConfig.publishMessage({
  //       routingKey: 'uploadFile',
  //       message: message,
  //       options: {
  //         persistent: true,
  //         queueName: 'uploadFile',
  //         durable: true,
  //       },
  //     });
  //     return true;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
}
