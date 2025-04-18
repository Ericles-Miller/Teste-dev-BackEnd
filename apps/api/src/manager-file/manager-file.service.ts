import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

@Injectable()
export class ManagerFileService {
  private readonly CHUNK_SIZE = 1024 * 1024;
  private readonly BATCH_SIZE = 10000;

  constructor(private readonly rabbitMqService: RabbitMqService) {}

  async processStream(file: Express.Multer.File): Promise<string> {
    const uploadId = uuid();

    const uploadDir = path.resolve(__dirname, '../../tmp');
    const filePath = path.join(uploadDir, `file-${uploadId}.csv`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, file.buffer);

    try {
      await this.validateCsvHeaders(filePath);

      this.processFile(filePath, uploadId)
        .then(() => {
          console.log(`File processing completed for: ${filePath}`);
        })
        .catch((error) => {
          console.error('Error processing file:', error);
        });

      return uploadId;
    } catch (error) {
      // Se houver erro na validação, remove o arquivo
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error removing invalid file:', unlinkError);
      }
      throw error;
    }
  }

  async processFile(filePath: string, uploadId: string): Promise<void> {
    const batch: CreateUserDto[] = [];
    let processedCount = 0;

    const fileStream = createReadStream(filePath, { highWaterMark: 128 * 1024 });
    const transformToObject = csv({
      separator: ';',
      skipComments: true,
      quote: '"',
      escape: '"',
      skipLines: 0, // Não pular a primeira linha, vamos usar os headers para mapear
      headers: [
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
      ],
    });

    const writableStreamFile = new Writable({
      objectMode: true,

      write: async (chunk, encoding, next) => {
        try {
          const userData: CreateUserDto = this.mapToUserDto(chunk);
          batch.push(userData);
          processedCount++;

          if (batch.length >= 1500) {
            fileStream.pause();
            await this.sendToQueue(uploadId, [...batch]);

            //self.redisService.instance.emit('set-status', EStatus.PROCESS);

            console.log(`Enviado batch de ${batch.length} registros. Total processado: ${processedCount}`);
            batch.length = 0;
            fileStream.resume();
          }

          next();
        } catch (error) {
          console.error('Error processing row:', error);
          next(error);
        }
      },
    });

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(transformToObject)
        .pipe(writableStreamFile)
        .on('finish', async () => {
          if (batch.length > 0) {
            await this.sendToQueue(uploadId, [...batch]);
            console.log(`Enviado batch de ${batch.length} registros. Total processado: ${processedCount}`);
          }

          resolve();
        })
        .on('error', reject);
    });
  }

  private mapToUserDto(data: any): CreateUserDto {
    return {
      id: data.id,
      gender: data.gender,
      nameSet: data.nameSet,
      title: data.title,
      givName: data.givName,
      surName: data.surName,
      streetAddress: data.streetAddress,
      city: data.city,
      emailAddress: data.emailAddress,
      tropicalZodiac: data.tropicalZodiac,
      occupation: data.occupation,
      vehicle: data.vehicle,
      countryFull: data.countryFull,
    };
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
            'Gender',
            'NameSet',
            'Title',
            'GivenName',
            'Surname',
            'StreetAddress',
            'City',
            'EmailAddress',
            'TropicalZodiac',
            'Occupation',
            'Vehicle',
            'CountryFull',
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
