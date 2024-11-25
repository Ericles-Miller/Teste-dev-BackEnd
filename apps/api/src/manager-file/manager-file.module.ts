import { Module } from '@nestjs/common';
import { ManagerFileController } from './manager-file.controller';
import { ManagerFileService } from './manager-file.service';
import { RabbitmqModule } from '@api/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
