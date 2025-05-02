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
    // Publica a mensagem no SNS
    const messageId = await this.snsConfig.publishProcessStatus(uploadId, status);

    // Invoca a Lambda para processar o status
    const message = {
      uploadId,
      status,
      timestamp: new Date().toISOString(),
    };

    await this.lambdaConfig.invokeStatusProcessor(message);

    return messageId;
  }
}
