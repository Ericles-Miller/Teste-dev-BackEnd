import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/database.provider';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { ManagerFileModule } from './manager-file/manager-file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    TestModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ManagerFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
