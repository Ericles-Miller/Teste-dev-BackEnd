import { Module } from '@nestjs/common';
import { FileStatusService } from './file-status.service';
import { FileStatusController } from './file-status.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FileStatusController],
  providers: [FileStatusService],
  exports: [FileStatusService],
})
export class FileStatusModule {}
