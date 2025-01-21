import { Module } from '@nestjs/common';
import { RedisProcessService } from './redis-process.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisProcessController } from './redis-process.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'REDIS_PROCESS_SERVICE',
        useFactory: async () => ({
          transport: Transport.REDIS,
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
