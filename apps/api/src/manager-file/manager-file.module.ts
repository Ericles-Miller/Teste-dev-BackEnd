import { Module } from '@nestjs/common';
import { ManagerFileController } from './manager-file.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { ManagerFileService } from './manager-file.service';

@Module({
  imports: [
    RabbitmqModule,
    // MulterModule.register({
    //   dest: './uploads',
    // }),
  ],
  controllers: [ManagerFileController],
  providers: [ManagerFileService],
})
export class ManagerFileModule {}
