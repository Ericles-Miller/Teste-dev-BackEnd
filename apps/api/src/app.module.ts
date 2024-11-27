import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/database.provider';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { UsersModule } from './users/users.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    TestModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ManagerFileModule,
    UsersModule,
    RedisModule,
  ],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
