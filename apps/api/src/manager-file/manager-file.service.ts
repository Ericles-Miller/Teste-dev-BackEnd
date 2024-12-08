import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RedisService } from '../redis/redis.service';
import { EStatus } from '../redis/status.enum';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly redisService: RedisService,
    private readonly awsService: AwsService,
  ) {}

  async uploadFile(file: any): Promise<string> {
    try {
      const uploadId = uuid();

      this.awsService.sendMessage(process.env.AWS_QUEUE_URL, {
        uploadId,
        //fileName: file.originalname,
        //fileBuffer: file.buffer.toString('base64'),
      });
      console.log('aaaa');

      this.redisService.instance.emit('set-status', EStatus.PROCESS);

      return uploadId;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async processFile(filePath: string): Promise<void> {
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
            this.awsService.sendMessage(process.env.QUEUE, {
              id: uuid(),
              body: {
                row,
              },
            });
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
