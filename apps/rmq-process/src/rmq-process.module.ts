import { Module } from '@nestjs/common';
import { ConsumerService } from './rmq-process.service';
import { UserModule } from 'apps/api/src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'apps/api/src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'apps/api/src/database/database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [],
  providers: [ConsumerService],
})
export class RmqProcessModule {}
