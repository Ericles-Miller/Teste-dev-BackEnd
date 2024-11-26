import { RabbitmqService } from '@api/rabbitmq/rabbitmq.service';
import { RedisService } from '@api/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { EStatus } from '@redis/status.enumerator';
import { ReadFileDto } from '@rmq/Dtos/read-file.Dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ManagerFileService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly redisService: RedisService,
  ) {}

  async uploadFile(file: any): Promise<string> {
    const uploadId = uuid();

    this.rabbitmqService.instance.emit('file-upload-queue', {
      uploadId,
      fileName: file.originalname,
      fileBuffer: file.buffer.toString('base64'),
    });

    return uploadId;
  }

  async readFile(data: ReadFileDto) {
    await this.rabbitmqService.instance.emit('process-file-queue', data);

    await this.redisService.instance.emit('set-status', { jobId: data.jobId, status: EStatus.PROCESS });
  }
}
