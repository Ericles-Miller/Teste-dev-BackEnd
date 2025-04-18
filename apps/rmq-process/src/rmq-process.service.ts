import { Injectable, OnModuleInit } from '@nestjs/common';
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
      console.error('Erro ao inicializar serviços:', error);
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
              const content = JSON.parse(message.content.toString());

              await this.processMessage(content, queue);
              channel.ack(message);
            }
          } catch {
            channel.nack(message, false, true);
          }
        });
      } catch (error) {
        console.error(`Erro ao configurar consumidor para a fila ${queue.name}:`, error);
      }
    }
  }

  private async processMessage(content: any, queue: IQueue): Promise<void> {
    try {
      switch (queue.name) {
        case 'processFile':
          await this.processFileMessage(content as SendToQueueProcessFileDto);
          break;
        default:
          console.warn(`Fila ${queue.name} não possui processador específico`);
      }
    } catch (error) {
      console.error(`Erro no processamento da mensagem na fila ${queue.name}:`, error);
      throw error;
    }
  }

  private async processFileMessage(message: SendToQueueProcessFileDto): Promise<void> {
    const { uploadId, batch } = message;

    try {
      console.log(`Processando batch com ${batch.length} itens para uploadId: ${uploadId}`);
      //await this.saveToS3(uploadId, batch);
      //await this.saveToDB(batch);
    } catch (error) {
      console.error(`Erro ao processar batch para uploadId: ${uploadId}`, error);
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
