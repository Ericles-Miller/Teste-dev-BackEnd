import { LambdaClient, LambdaClientConfig, InvokeCommand } from '@aws-sdk/client-lambda';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LambdaConfig extends LambdaClient {
  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const config: LambdaClientConfig = {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      region: process.env.AWS_REGION || 'us-east-1',
    };

    if (isDevelopment) {
      config.endpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
    }

    super(config);
  }

  /**
   * Invoca a função Lambda que processa o status do arquivo
   * @param uploadId - ID único do upload
   * @param status - Status atual do processamento
   */
  async invokeStatusProcessor(message: any): Promise<void> {
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'process-file-status';

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(message)),
      InvocationType: 'Event', // Async invocation
    });

    await this.send(command);
  }
}
