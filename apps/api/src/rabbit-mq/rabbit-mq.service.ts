import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject('RABBIT_MQ_SERVICE')
    public readonly instance: ClientRMQ,
  ) {}
}
