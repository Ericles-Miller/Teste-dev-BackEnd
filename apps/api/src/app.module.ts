import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/database.provider';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { UsersModule } from './users/users.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,

    TypeOrmModule.forRoot(dataSourceOptions),
    ManagerFileModule,
    UsersModule,
    RedisModule,
  ],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
