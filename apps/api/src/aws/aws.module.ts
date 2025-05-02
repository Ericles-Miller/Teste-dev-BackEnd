import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SnsConfig } from './config/sns.config';
import { LambdaConfig } from './config/lambda.config';
import { FileStatusModule } from '../file-status/file-status.module';

@Module({
  imports: [FileStatusModule],
  controllers: [],
  providers: [
    AwsService,
    SnsConfig,
    LambdaConfig,
    {
      provide: SQSClient,
      useFactory: () => {
        return new SQSClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
      },
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
