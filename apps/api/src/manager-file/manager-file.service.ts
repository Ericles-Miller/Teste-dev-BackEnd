import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ManagerFileService {
  private readonly CHUNK_SIZE = 1024 * 1024;
  private readonly BATCH_SIZE = 1000;

  constructor(private readonly rabbitMqService: RabbitMqService) {}

  async processStream(file: Express.Multer.File): Promise<string> {
    const uploadId = uuid();
    let processedRows = 0;
    let currentBatch: CreateUserDto[] = [];

    const headers = await this.validateCsvHeaders(file.path);

    const fileStream = createReadStream(file.path);

    return new Promise<string>((resolve, reject) => {
      fileStream
        .pipe(
          csv({
            headers: headers,
            skipLines: 1,
          }),
        )
        .on('data', async (row: CreateUserDto) => {
          try {
            currentBatch.push(row);
            processedRows++;

            if (currentBatch.length >= this.BATCH_SIZE) {
              await this.sendToQueue(uploadId, currentBatch);
              currentBatch = [];
            }

            // Atualizar status a cada 1000 linhas
            if (processedRows % 1000 === 0) {
              console.log(`Processadas ${processedRows} linhas`);
              // chamar o redis aqui ou o pulling
            }
          } catch (error) {
            reject(error);
          }
        })
        .on('end', async () => {
          try {
            // Processar batch restante
            if (currentBatch.length > 0) {
              await this.sendToQueue(uploadId, currentBatch);
            }

            console.log(`Processamento concluído. Total de linhas: ${processedRows}`);
            resolve(uploadId);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async sendToQueue(uploadId: string, batch: CreateUserDto[]): Promise<void> {
    await this.rabbitMqService.sendToQueueProcessFile({
      uploadId,
      batch,
    });
  }

  private async validateCsvHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers: string[]) => {
          const requiredHeaders = [
            'id',
            'gender',
            'nameSet',
            'title',
            'givName',
            'surName',
            'streetAddress',
            'city',
            'emailAddress',
            'tropicalZodiac',
            'occupation',
            'vehicle',
            'countryFull',
          ];

          const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
          if (missingHeaders.length > 0) {
            reject(new BadRequestException(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(', ')}`));
          }

          stream.destroy();
          resolve(headers);
        })
        .on('error', () => {
          reject(new BadRequestException('Erro ao ler o arquivo CSV'));
        });
    });
  }
}
