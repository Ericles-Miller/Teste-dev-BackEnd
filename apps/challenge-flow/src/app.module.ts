import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RedisModule } from 'apps/redis/src/redis.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { dataSourceOptions } from './database/database.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule,
    UserModule,
    RabbitMqModule,
    ManagerFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
