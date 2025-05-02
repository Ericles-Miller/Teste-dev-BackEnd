import { Module } from '@nestjs/common';
import { ManagerFileController } from './manager-file.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { ManagerFileService } from './manager-file.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [RabbitmqModule, AwsModule],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
