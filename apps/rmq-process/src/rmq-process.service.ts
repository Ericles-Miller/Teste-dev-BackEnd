import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { IQueue } from 'apps/api/src/rabbitmq/interfaces/queue.interface';
import { queues } from 'apps/api/src/rabbitmq/queue.constants';
import { RabbitMqConfig } from 'apps/api/src/rabbitmq/rabbitmq.config';
import { SendToQueueProcessFileDto } from 'apps/api/src/rabbitmq/dtos/send-to-queue-process-file.dto';
import { S3Config } from 'apps/api/src/config/s3.config';

@Injectable()
export class ConsumerService implements OnModuleInit {
  async onModuleInit() {
    try {
      await RabbitMqConfig.connect();
      await this.setupConsumers();
      await S3Config.ensureBucketExists();
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

                  await this.processMessage(content, queue);
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
        // redis return error
      }
    }
  }

  private async processMessage({ batch, uploadId }: SendToQueueProcessFileDto, queue: IQueue): Promise<void> {
    try {
      await this.saveToS3(uploadId, batch);
      await this.saveToDB(batch);
    } catch (error) {
      console.error(`Erro no processamento da mensagem na fila ${queue.name}:`, error);
      throw error;
    }
  }

  private async saveToS3(uploadId: string, batch: any[]): Promise<void> {
    const batchId = Date.now(); // Identificador único para o batch
    const key = `uploads/${uploadId}/batch-${batchId}.json`;

    try {
      await S3Config.saveObject(key, batch);
      console.log(`Batch salvo no S3: ${key}`);
    } catch (error) {
      console.error(`Erro ao salvar batch no S3: ${key}`, error);
      throw error;
    }
  }

  private async saveToDB(batch: any[]): Promise<void> {
    // Implementar lógica para salvar no banco de dados
    // Exemplo: await this.userRepository.saveMany(batch);
    console.log(`Batch enviado para processamento no banco de dados, ${batch.length} registros`);
  }
}
