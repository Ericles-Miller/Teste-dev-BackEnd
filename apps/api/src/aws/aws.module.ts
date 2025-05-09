import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SnsConfig } from './config/sns.config';
import { S3Config } from './config/s3.config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [
    AwsService,
    SnsConfig,
    S3Config,
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
