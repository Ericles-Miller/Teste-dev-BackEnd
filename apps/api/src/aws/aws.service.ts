import { Injectable, OnModuleInit } from '@nestjs/common';
import { EStatusFile } from '../manager-file/status-file.enum';
import { SnsConfig } from './config/sns.config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AwsService implements OnModuleInit {
  constructor(
    private readonly snsConfig: SnsConfig,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    console.log('AWS Service initialized');
  }

  async publishProcessStatus(uploadId: string, status: EStatusFile): Promise<string> {
    const messageId = await this.snsConfig.publishProcessStatus(uploadId, status);

    await this.redisService.publish(uploadId, status);
    return messageId;
  }
}
