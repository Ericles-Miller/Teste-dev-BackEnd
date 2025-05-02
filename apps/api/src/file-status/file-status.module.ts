import { Module } from '@nestjs/common';
import { FileStatusService } from './file-status.service';
import { FileStatusController } from './file-status.controller';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [FileStatusController],
  providers: [FileStatusService],
  exports: [FileStatusService],
})
export class FileStatusModule {}
