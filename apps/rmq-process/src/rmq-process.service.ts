import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { queues } from 'apps/api/src/rabbitmq/queue.constants';
import { RabbitMqConfig } from 'apps/api/src/rabbitmq/rabbitmq.config';
import { SendToQueueProcessFileDto } from 'apps/api/src/rabbitmq/dtos/send-to-queue-process-file.dto';
import { UserService } from 'apps/api/src/user/user.service';
import { CreateUserDto } from 'apps/api/src/user/dto/create-user.dto';
import { RedisService } from 'apps/api/src/redis/redis.service';
import { EStatusFile } from 'apps/api/src/manager-file/status-file.enum';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    try {
      await RabbitMqConfig.connect();
      await this.setupConsumers();
    } catch (error) {
      throw new InternalServerErrorException('Error to started service:', error);
    }
  }

  private async setupConsumers(): Promise<void> {
    const channel = RabbitMqConfig.getChannel();

    for (const queue of queues) {
      try {
        await channel.assertQueue(queue.name, {
          durable: queue.durable,
        });

        channel.consume(queue.name, async (message) => {
          try {
            if (message) {
              await channel.assertQueue(queue.name, {
                durable: queue.durable,
              });

              channel.consume(queue.name, async (message) => {
                if (message) {
                  const contentAsString = message.content.toString();

                  const content: SendToQueueProcessFileDto = JSON.parse(contentAsString);

                  await this.processMessage(content);
                  channel.ack(message);
                }
              });
            }
          } catch {
            channel.nack(message, false, true);
          }
        });
      } catch {
        // log elastic
      }
    }
  }

  private async processMessage({ batch, uploadId, isLastBatch }: SendToQueueProcessFileDto): Promise<void> {
    await this.saveToDB(batch, uploadId, isLastBatch);
  }

  private async saveToDB(batch: CreateUserDto[], uploadId: string, isLastBatch: boolean): Promise<void> {
    try {
      await this.userService.createMany(batch, uploadId, isLastBatch);
    } catch (error) {
      await this.redisService.publish(uploadId, EStatusFile.ProcessError);
      throw new InternalServerErrorException('Error to save file in database', error);
    }
  }
}
