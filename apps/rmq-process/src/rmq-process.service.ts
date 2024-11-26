import { Injectable } from '@nestjs/common';
import { MessagePattern, RmqContext } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import { v7 as uuid } from 'uuid';
import { ReadFileDto } from './Dtos/read-file.Dto';

@Injectable()
export class RmqProcessService {
  constructor() {} //private readonly rabbitmqService: RabbitmqService, //private readonly redisService: RedisService,

  @MessagePattern('file-upload-queue')
  async uploadFile(data: any, context: RmqContext): Promise<void> {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const jobId = uuid();
      const uploadDir = path.resolve(__dirname, '../../tmp');
      const filePath = path.join(uploadDir, `file-${jobId}.csv`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));

      // await this.rabbitmqService.instance.emit('process-file', { jobId, filePath });
      // await this.redisService.instance.emit('set-status', { jobId, status: EStatus.PROCESS });

      chanel.ack(originalMsg);
    } catch (error) {
      console.error(error);
      chanel.nack(originalMsg);
    }
  }

  @MessagePattern('process-file')
  async readFile({ jobId, filePath }: ReadFileDto): Promise<void> {}
}
