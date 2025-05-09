import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/database.provider';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ManagerFileModule,
    UserModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
