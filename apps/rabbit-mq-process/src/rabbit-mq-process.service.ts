import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from '@aws-sdk/client-sqs';
import { config } from './config';

@Injectable()
export class RabbitMqProcessService {
  @SqsMessageHandler(config.queue, false)
  async fileProcess(message: AWS.Message): Promise<void> {
    const { uploadId, batch } = JSON.parse(message.Body);

    try {
      console.log(uploadId, '---', batch);
    } catch (error) {
      console.error(error);
    }
  }
}
