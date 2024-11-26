import { Module } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RmqProcessService],
})
export class RmqProcessModule {}
