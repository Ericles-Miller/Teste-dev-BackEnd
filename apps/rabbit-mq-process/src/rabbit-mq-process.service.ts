import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from '@aws-sdk/client-sqs';
import { config } from './config';
import { UserService } from 'apps/api/src/user/user.service';
import { CreateUserDto } from 'apps/api/src/user/dto/create-user.dto';

@Injectable()
export class RabbitMqProcessService {
  private readonly BATCH_SIZE = 1000;
  private readonly MAX_RETRIES = 3;
  private readonly BACKOFF_TIME = 1000;

  constructor(private readonly userService: UserService) {}

  private async processWithRetry(batch: CreateUserDto[], retryCount = 0): Promise<void> {
    try {
      console.log(batch[0], 'aaaaaaaaa');

      await this.userService.createMany(batch);
    } catch (error) {
      if (retryCount >= this.MAX_RETRIES) throw error;

      await new Promise((resolve) => setTimeout(resolve, this.BACKOFF_TIME * Math.pow(2, retryCount)));

      //return this.processWithRetry(batch, retryCount + 1);
    }
  }

  @SqsMessageHandler(config.queue, false)
  async fileProcess(message: AWS.Message): Promise<void> {
    const { uploadId, batch } = JSON.parse(message.Body);
    console.log(batch);

    try {
      // for (let i = 0; i < batch.length; i += this.BATCH_SIZE) {
      //   const chunk = batch.slice(i, i + this.BATCH_SIZE);
      //   //await this.processWithRetry(chunk);
      // }
      //console.log(`Batch ${uploadId} processed successfully`);
    } catch (error) {
      console.error(`Failed to process batch ${uploadId}:`, error);
      throw error;
    }
  }
}
