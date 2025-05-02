import { Injectable, OnModuleInit } from '@nestjs/common';
import { ResponseProcessFileDto } from '../manager-file/response-process-file.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FileStatusService implements OnModuleInit {
  constructor(private redisService: RedisService) {}

  onModuleInit() {}

  async getFileStatus(uploadId: string): Promise<ResponseProcessFileDto> {
    const statusData = await this.redisService.get(`file-status:${uploadId}`);
    return statusData || null;
  }
}
