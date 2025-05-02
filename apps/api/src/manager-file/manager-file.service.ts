import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Transform, Writable } from 'stream';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AwsService } from '../aws/aws.service';
import { EStatusFile } from './status-file.enum';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly awsService: AwsService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadId = uuid();

    if (!file || !file.buffer) {
      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
      throw new BadRequestException('Invalid file');
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, `file-${uploadId}.csv`);

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    try {
      fs.writeFileSync(filePath, file.buffer);

      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessNotInitialized);

      this.processFile(filePath, uploadId)
        .then(() => {})
        .catch(() => {});

      return uploadId;
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Error to process file', error);
    }
  }

  async processFile(filePath: string, uploadId: string): Promise<void> {
    let processedCount = 0;

    if (!fs.existsSync(filePath)) {
      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
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

        if (processedCount % 5000 === 0) {
          await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessInProgress);
        }

        if (batch.length >= 1000) {
          fileStream.pause();
          await this.sendToQueue(uploadId, batch);

          await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessInProgress);

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

          await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessCompleted);

          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve();
        })
        .on('error', reject);
    });
  }

  private async sendToQueue(uploadId: string, batch: CreateUserDto[]): Promise<void> {
    await this.rabbitMqService.sendToQueueProcessFile(uploadId, batch);
  }
}
