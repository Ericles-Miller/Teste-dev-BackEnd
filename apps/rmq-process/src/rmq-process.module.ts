import { Module } from '@nestjs/common';
import { ConsumerService } from './rmq-process.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConsumerService],
})
export class RmqProcessModule {}
