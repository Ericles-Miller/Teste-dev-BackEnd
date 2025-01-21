import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT-MQ-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'file-process',
          queueOptions: {
            noAck: false,
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
