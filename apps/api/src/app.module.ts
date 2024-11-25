import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [RabbitmqModule, TestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
