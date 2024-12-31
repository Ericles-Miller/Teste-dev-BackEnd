import { Module } from '@nestjs/common';
import { RabbitMqProcessService } from './rabbit-mq-process.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from './config';
import { UserModule } from 'apps/api/src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'apps/api/src/database/database.provider';
import { RedisModule } from 'apps/api/src/redis/redis.module';

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
    RedisModule,
  ],
  providers: [RabbitMqProcessService],
  exports: [],
  controllers: [],
})
export class RabbitMqProcessModule {}
