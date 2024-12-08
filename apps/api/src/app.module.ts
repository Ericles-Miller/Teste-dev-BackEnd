import { Module } from '@nestjs/common';
import { dataSourceOptions } from './database/database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { ManagerFileModule } from './manager-file/manager-file.module';
import { UserModule } from './user/user.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), RedisModule, UserModule, ManagerFileModule, AwsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
