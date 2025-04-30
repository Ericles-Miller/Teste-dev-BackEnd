import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Transform, Writable } from 'stream';
import { CreateUserDto } from '../users/dto/create-user.dto';

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

      //await this.validateCsvHeaders(filePath);

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

    const batch: CreateUserDto[] = [];

    const fileStream = createReadStream(filePath, { highWaterMark: 128 * 1024 });
    const transformToObject = csv({
      separator: ',',
      skipComments: true,
      skipLines: 1,
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

    const writableStreamFile = new Transform({
      objectMode: true,
      transform: async (chunk, encoding, callback) => {
        const jsonStr = JSON.stringify(chunk);
        callback(null, jsonStr);
      },
    });

    const writeTableStream = new Writable({
      write: async (chunk, encoding, next) => {
        const stringData = chunk.toString();
        const dataRow: CreateUserDto = JSON.parse(stringData);

        batch.push(dataRow);
        processedCount++;

        if (batch.length >= 1000) {
          fileStream.pause();
          await this.sendToQueue(uploadId, batch);

          //self.redisService.instance.emit('set-status', EStatus.PROCESS);

          console.log(`Send batch ${batch.length}. Total process: ${processedCount}`);
          batch.length = 0;
          fileStream.resume();
        }
        next();
      },
    });

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(transformToObject)
        .pipe(writableStreamFile)
        .pipe(writeTableStream)
        .on('finish', async () => {
          if (batch.length > 0) await this.sendToQueue(uploadId, batch);

          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve();
        })
        .on('error', reject);
    });
  }

  private async sendToQueue(uploadId: string, batch: CreateUserDto[]): Promise<void> {
    await this.rabbitMqService.sendToQueueProcessFile(uploadId, batch);
  }

  // private async validateCsvHeaders(filePath: string): Promise<string[]> {
  //   return new Promise((resolve, reject) => {
  //     const stream = createReadStream(filePath)
  //       .pipe(csv())
  //       .on('headers', (headers: string[]) => {
  //         const requiredHeaders = [
  //           'Gender',
  //           'NameSet',
  //           'Title',
  //           'GivenName',
  //           'Surname',
  //           'StreetAddress',
  //           'City',
  //           'EmailAddress',
  //           'TropicalZodiac',
  //           'Occupation',
  //           'Vehicle',
  //           'CountryFull',
  //         ];

  //         const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  //         if (missingHeaders.length > 0) {
  //           reject(new BadRequestException(`Missing mandatory headers: ${missingHeaders.join(', ')}`));
  //         }

  //         stream.destroy();
  //         resolve(headers);
  //       })
  //       .on('error', () => {
  //         reject(new BadRequestException('Error reading CSV file'));
  //       });
  //   });
  // }
}
