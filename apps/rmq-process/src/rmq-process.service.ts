import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { queues } from 'apps/api/src/rabbitmq/queue.constants';
import { RabbitMqConfig } from 'apps/api/src/rabbitmq/rabbitmq.config';
import { SendToQueueProcessFileDto } from 'apps/api/src/rabbitmq/dtos/send-to-queue-process-file.dto';
import { UserService } from 'apps/api/src/user/user.service';
import { CreateUserDto } from 'apps/api/src/user/dto/create-user.dto';
import { AwsService } from 'apps/api/src/aws/aws.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AwsService,
  ) {}

  async onModuleInit() {
    try {
      await RabbitMqConfig.connect();
      await this.setupConsumers();
      // await S3Config.ensureBucketExists();
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

  private async processMessage({ batch, uploadId }: SendToQueueProcessFileDto): Promise<void> {
    try {
      // await this.saveToS3(uploadId, batch); -- vamos salvar o arquivo no s3 quando for completo o funcionamento
      await this.saveToDB(batch, uploadId);
    } catch (error) {
      throw new InternalServerErrorException('Error to process file and save in database', error);
    }
  }

  // private async saveToS3(uploadId: string, batch: any[]): Promise<void> {
  //   const batchId = Date.now();
  //   const key = `uploads/${uploadId}/batch-${batchId}.json`;

  //   try {
  //     await S3Config.saveObject(key, batch);
  //     console.log(`Batch salvo no S3: ${key}`);
  //   } catch (error) {
  //     console.error(`Erro ao salvar batch no S3: ${key}`, error);
  //     throw error;
  //   }
  // }

  private async saveToDB(batch: CreateUserDto[], uploadId: string): Promise<void> {
    await this.userService.createMany(batch, uploadId);
  }
}
