import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ReadFileDto } from '../rabbit-mq/Dtos/read-file.dto';
import { RabbitMqService } from '../rabbit-mq/rabbit-mq.service';
import { RedisService } from '../redis/redis.service';
import { EStatus } from '../redis/status.enum';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly redisService: RedisService,
  ) {}

  async uploadFile(file: any): Promise<string> {
    try {
      const uploadId = uuid();

      this.rabbitMqService.instance.emit('file-upload-queue', {
        uploadId,
        fileName: file.originalname,
        fileBuffer: file.buffer.toString('base64'),
      });

      this.redisService.instance.emit('set-status', EStatus.PROCESS);

      return uploadId;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async processFile({ filePath, jobId }: ReadFileDto): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const fileStream = createReadStream(filePath);
      fileStream
        .pipe(
          csv({
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
          }),
        )
        .on('data', async (row: CreateUserDto) => {
          try {
            this.rabbitMqService.instance.emit('process-csv-row', { row });
            this.redisService.instance.emit('set-status', EStatus.PROCESS);
          } catch (error) {
            console.error('Erro ao processar linha:', row, error);
            this.redisService.instance.emit('set-status', EStatus.ERROR);
          }
        })
        .on('end', () => {
          this.redisService.instance.emit('set-status', EStatus.COMPLETED);
          resolve();
        })
        .on('error', (error) => {
          this.redisService.instance.emit('set-status', EStatus.ERROR);
          reject(error);
        });
    });
  }
}
