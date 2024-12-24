import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { v4 as uuid } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { EStatus } from '../redis/status.enum';
import { AwsService } from '../aws/aws.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'apps/rabbit-mq-process/src/config';
import { Transform, Writable } from 'stream';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly redisService: RedisService,
    private readonly awsService: AwsService,
  ) {}

  async uploadFile(file: any): Promise<string> {
    try {
      const uploadId = uuid();

      const uploadDir = path.resolve(__dirname, '../../tmp');
      const filePath = path.join(uploadDir, `file-${uploadId}.csv`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await fs.promises.writeFile(filePath, file.buffer);

      this.redisService.instance.emit('set-status', EStatus.PROCESS);

      this.processFile(filePath)
        .then(() => {
          console.log(`File processing completed for: ${filePath}`);
        })
        .catch((error) => {
          console.error('Error processing file:', error);
        });

      return uploadId;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async processFile(filePath: string): Promise<void> {
    const batch: CreateUserDto[] = [];
    let processedCount = 0;
    const self = this;

    const fileStream = createReadStream(filePath);
    const transformToObject = csv({
      separator: ';',
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
    const transformToString = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        callback(null, JSON.stringify(chunk));
      },
    });


    const writableStreamFile = new Writable({
      objectMode: true,

      async write(chunk, encoding, next) {
        const rowData = JSON.parse(chunk) as CreateUserDto;
        batch.push(rowData);
        processedCount++;

        if (batch.length >= 1000) {
          fileStream.pause();
          await self.sendBatchMessages([...batch]);

          self.redisService.instance.emit('set-status', EStatus.PROCESS);

          console.log(`Enviado batch de ${batch.length} registros. Total processado: ${processedCount}`);
          batch.length = 0;
          fileStream.resume();
        }

        next();
      },
    });

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(transformToObject)
        .pipe(transformToString)
        .pipe(writableStreamFile)
        .on('finish', async () => {
          if (batch.length > 0) {
            await this.sendBatchMessages([...batch]);
            console.log(`Enviado batch de ${batch.length} registros. Total processado: ${processedCount}`);
          }

          this.redisService.instance.emit('set-status', EStatus.PROCESS);
          resolve();
        })
        .on('error', reject);
    });
  }

  private async sendBatchMessages(batch: CreateUserDto[]): Promise<void> {
    await this.awsService.sendMessage(config.queueUrl, {
      id: uuid(),
      batch,
    });
  }
}
