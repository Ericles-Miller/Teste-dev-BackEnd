import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
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

    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid file');
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, `file-${uploadId}.csv`);

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    try {
      fs.writeFileSync(filePath, file.buffer);

      await this.validateCsvHeaders(filePath);

      this.processFile(filePath, uploadId)
        .then(() => {})
        .catch(() => {});

      return uploadId;
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Error to process file', error);
    }
  }

  async processFile(filePath: string, uploadId: string): Promise<void> {
    let processedCount = 0;

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(`Not Found File: ${filePath}`);
    }

    const batch: string[] = [];

    const fileStream = createReadStream(filePath, { highWaterMark: 128 * 1024 });
    const transformToObject = csv({
      separator: ';',
      skipComments: true,
      quote: '"',
      escape: '"',
      skipLines: 0,
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
          batch.push(chunk);
          processedCount++;

          if (batch.length >= 1500) {
            fileStream.pause();
            await this.sendToQueue(uploadId, [...batch]);

            //self.redisService.instance.emit('set-status', EStatus.PROCESS);

            console.log(`Send batch ${batch.length}. Total process: ${processedCount}`);
            batch.length = 0;
            fileStream.resume();
          }

          next();
        } catch (error) {
          next(error);
        }
      },
    });

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(transformToObject)
        .pipe(writableStreamFile)
        .on('finish', async () => {
          try {
            if (batch.length > 0) await this.sendToQueue(uploadId, [...batch]);

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  private async sendToQueue(uploadId: string, batch: string[]): Promise<void> {
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
            reject(new BadRequestException(`Missing mandatory headers: ${missingHeaders.join(', ')}`));
          }

          stream.destroy();
          resolve(headers);
        })
        .on('error', () => {
          reject(new BadRequestException('Error reading CSV file'));
        });
    });
  }
}
