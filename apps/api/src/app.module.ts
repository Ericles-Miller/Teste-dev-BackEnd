import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/database.provider';
import { TestModule } from './test/test.module';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { RedisModule } from './redis/redis.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    TestModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ManagerFileModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
