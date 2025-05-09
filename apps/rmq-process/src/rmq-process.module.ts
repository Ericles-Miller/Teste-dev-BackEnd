import { Module } from '@nestjs/common';
import { ConsumerService } from './rmq-process.service';
import { UserModule } from 'apps/api/src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'apps/api/src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'apps/api/src/database/database.provider';
import { AwsModule } from 'apps/api/src/aws/aws.module';
import { RedisModule } from 'apps/api/src/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AwsModule,
    RedisModule,
  ],
  controllers: [],
  providers: [ConsumerService],
})
export class RmqProcessModule {}
