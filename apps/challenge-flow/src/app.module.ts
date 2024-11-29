import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/database.provider';
import { UserModule } from './user/user.module';
import { RedisModule } from 'apps/redis/src/redis.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { ManagerFileModule } from './manager-file/manager-file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule,
    UserModule,
    RabbitMqModule,
    ManagerFileModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
