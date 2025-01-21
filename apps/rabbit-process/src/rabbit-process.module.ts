import { Module } from '@nestjs/common';
import { RabbitProcessController } from './rabbit-process.controller';
import { RabbitProcessService } from './rabbit-process.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from 'apps/api/src/user/user.module';
import { dataSourceOptions } from 'apps/api/src/database/database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'apps/api/src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    RedisModule,
    ClientsModule.register([
      {
        name: 'RABBIT-MQ-PROCESS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'file-process',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [RabbitProcessController],
  providers: [RabbitProcessService],
})
export class RabbitProcessModule {}
