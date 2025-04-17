import { Module } from '@nestjs/common';
import { ManagerFileController } from './manager-file.controller';
import { ManagerFileService } from './manager-file.service';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    RabbitmqModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
