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
    return new Promise<void>((resolve, reject) => {
      const batchSize = 100;
      let batch = [];

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
          batch.push({ id: uuid(), row });

          if (batch.length >= batchSize) {
            try {
              await this.sendBatchMessages(batch);
              batch = [];

              this.redisService.instance.emit('set-status', EStatus.PROCESS);
            } catch (error) {
              console.error('Erro ao processar linha:', row, error);
              this.redisService.instance.emit('set-status', EStatus.ERROR);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            try {
              await this.sendBatchMessages(batch);
              this.redisService.instance.emit('set-status', EStatus.PROCESS);
            } catch (error) {
              console.error('Erro ao processar batch final:', batch, error);
              this.redisService.instance.emit('set-status', EStatus.ERROR);
            }
          }
          this.redisService.instance.emit('set-status', EStatus.COMPLETED);
          resolve();
        })
        .on('error', (error) => {
          this.redisService.instance.emit('set-status', EStatus.ERROR);
          reject(error);
        });
    });
  }

  private async sendBatchMessages(batch: any[]): Promise<void> {
    await this.awsService.sendMessage(config.queueUrl, {
      id: uuid(),
      batch,
    });
  }
}
