import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { RedisService } from '../redis/redis.service';
import { ResponseProcessFileDto } from './dto/response-process-file.dto';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly awsService: AwsService,
    private readonly redisService: RedisService,
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

        if (batch.length >= 1000) {
          fileStream.pause();
          await this.sendToQueue(uploadId, batch, false);

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
          if (batch.length > 0) {
            await this.sendToQueue(uploadId, batch, true);
            console.log(`Send batch ${batch.length}. Total process: ${processedCount}`);
          } else {
            await this.sendToQueue(uploadId, [], true);
          }

          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve();
        })
        .on('error', reject);
    });
  }

  private async sendToQueue(uploadId: string, batch: CreateUserDto[], isLastBatch: boolean): Promise<void> {
    await this.rabbitMqService.sendToQueueProcessFile(uploadId, batch, isLastBatch);
  }

  async getStatusProcessFile(uploadId: string): Promise<ResponseProcessFileDto> {
    const status = await this.redisService.get(uploadId);

    if (!status) throw new NotFoundException('uploadId not found');

    return { status, uploadId };
  }
}
