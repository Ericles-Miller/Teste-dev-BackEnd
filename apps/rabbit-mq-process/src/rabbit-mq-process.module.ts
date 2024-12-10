import { Module } from '@nestjs/common';
import { RabbitMqProcessService } from './rabbit-mq-process.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from './config';

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: config.queue,
          queueUrl: config.queueUrl,
          region: config.region,
        },
      ],
    }),
  ],
  providers: [RabbitMqProcessService],
  exports: [],
  controllers: [],
})
export class RabbitMqProcessModule {}
