import { Module } from '@nestjs/common';
import { dataSourceOptions } from './database/database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { UserModule } from './user/user.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule,
    ManagerFileModule,
    UserModule,
    RabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
