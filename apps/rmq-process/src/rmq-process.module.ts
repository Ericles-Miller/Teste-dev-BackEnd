import { Module } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { UsersModule } from '@api/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [RmqProcessService],
})
export class RmqProcessModule {}
