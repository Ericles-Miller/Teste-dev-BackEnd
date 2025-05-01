import { InternalServerErrorException } from '@nestjs/common';
import * as amqp from 'amqplib';
import 'dotenv/config';
import { EXCHANGE_NAME, EXCHANGE_TYPE, queues } from './queue.constants';
import { IQueue } from './interfaces/queue.interface';
import { IPublishMessage } from './interfaces/publish-message.interface';

export class RabbitMqConfig {
  private static connection: amqp.ChannelModel;
  private static channel: any = null;
  private static isInitialized = false;

  static async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL, {
        timeout: 15000,
        heartbeat: 60,
      });

      if (this.connection) {
        this.channel = await this.connection.createChannel();

        await this.setupExchange();
        await this.setupQueuesAndBindings();
      }
    } catch (error) {
      throw new InternalServerErrorException('Error connecting to RabbitMQ:', error);
    }
  }

  static isConnected(): boolean {
    return this.isInitialized && this.channel !== null && this.connection !== null;
  }

  private static async setupExchange(): Promise<void> {
    await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });
  }

  private static async setupQueuesAndBindings(): Promise<void> {
    for (const queue of queues) {
      await this.setupQueue(queue);
    }
  }

  private static async setupQueue(queue: IQueue): Promise<void> {
    await this.channel.assertQueue(queue.name, { durable: queue.durable });

    for (const routingKey of queue.routingKeys) {
      await this.channel.bindQueue(queue.name, EXCHANGE_NAME, routingKey);
    }
  }

  static getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new InternalServerErrorException('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  static async publishMessage({ routingKey, message, options }: IPublishMessage): Promise<boolean> {
    try {
      return this.channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)), {
        persistent: options.persistent ?? true,
        options,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error publishing message:', error);
    }
  }

  static async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      throw new InternalServerErrorException('Error closing RabbitMQ connection:', error);
    }
  }
}
