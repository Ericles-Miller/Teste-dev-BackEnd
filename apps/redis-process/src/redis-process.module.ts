import { Module } from '@nestjs/common';
import { RedisProcessService } from './redis-process.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisProcessController } from './redis-process.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_PROCESS_SERVICE',
        useFactory: async () => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 6379,
          },
        }),
      },
    ]),
  ],
  controllers: [RedisProcessController],
  providers: [RedisProcessService],
  exports: [RedisProcessService],
})
export class RedisProcessModule {}
