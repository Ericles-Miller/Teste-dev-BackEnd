import { Module } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { UsersModule } from 'apps/api/src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [RmqProcessService],
})
export class RmqProcessModule {}
