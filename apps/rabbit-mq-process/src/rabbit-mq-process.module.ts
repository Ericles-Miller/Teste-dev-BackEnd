import { Module } from '@nestjs/common';
import { RabbitMqProcessService } from './rabbit-mq-process.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from './config';
import { UserModule } from 'apps/api/src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'apps/api/src/database/database.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SqsModule.register({
      consumers: [
        {
          name: config.queue,
          queueUrl: config.queueUrl,
          region: config.region,
        },
      ],
    }),
    UserModule,
  ],
  providers: [RabbitMqProcessService],
  exports: [],
  controllers: [],
})
export class RabbitMqProcessModule {}
