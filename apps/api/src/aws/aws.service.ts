import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  constructor(private readonly sqsClient: SQSClient) {}

  async sendMessage(queueUrl: string, message: Record<string, any>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });
    await this.sqsClient.send(command);
  }
}
