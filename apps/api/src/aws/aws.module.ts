import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: process.env.QUEUE,
          queueUrl: process.env.AWS_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    AwsService,
    {
      provide: SQSClient,
      useFactory: () => {
        const customHttpHandler = new NodeHttpHandler({
          connectionTimeout: 3000,
          socketTimeout: 3000,
        });

        return new SQSClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          requestHandler: customHttpHandler,
        });
      },
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
