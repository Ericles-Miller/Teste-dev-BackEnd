import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RabbitMqConfig } from './rabbitmq.config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AwsService } from '../aws/aws.service';
import { EStatusFile } from '../manager-file/status-file.enum';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly awsService: AwsService) {}

  async onModuleInit() {
    await RabbitMqConfig.connect();
  }

  async onModuleDestroy() {
    await RabbitMqConfig.closeConnection();
  }

  async sendToQueueProcessFile(uploadId: string, batch: CreateUserDto[]): Promise<boolean> {
    try {
      const message = {
        uploadId,
        batch,
      };

      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessInProgress);

      await RabbitMqConfig.publishMessage({
        routingKey: 'processFile',
        message,
        options: {
          persistent: true,
          queueName: 'processFile',
          durable: true,
        },
      });

      return true;
    } catch (error) {
      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
      throw new InternalServerErrorException(error);
    }
  }
}
