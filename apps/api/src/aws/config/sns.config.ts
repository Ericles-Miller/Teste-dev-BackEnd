import { SNSClient } from '@aws-sdk/client-sns';

export class SnsConfig extends SNSClient {
  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const config: any = {
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
}
