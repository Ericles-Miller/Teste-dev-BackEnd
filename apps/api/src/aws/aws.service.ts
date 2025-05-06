import { Injectable, OnModuleInit } from '@nestjs/common';
import { EStatusFile } from '../manager-file/status-file.enum';
import { SnsConfig } from './config/sns.config';
import { LambdaConfig } from './config/lambda.config';

@Injectable()
export class AwsService implements OnModuleInit {
  constructor(
    private readonly snsConfig: SnsConfig,
    private readonly lambdaConfig: LambdaConfig,
  ) {}

  async onModuleInit() {
    console.log('AWS Service initialized');
  }

  async publishProcessStatus(uploadId: string, status: EStatusFile): Promise<string> {
    const messageId = await this.snsConfig.publishProcessStatus(uploadId, status);

    const message = {
      uploadId,
      status,
    };

    await this.lambdaConfig.invokeStatusProcessor(message);

    return messageId;
  }
}
