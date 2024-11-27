import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import { error } from 'console';
import { ProcessFileDto } from 'apps/api/src/rabbitmq/dtos/process-file.dto';
import { UsersService } from 'apps/api/src/users/users.service';
import { CreateUserDto } from 'apps/api/src/users/dto/create-user.dto';

@Injectable()
export class RmqProcessService {
  constructor(private readonly userService: UsersService) {} //private readonly rabbitmqService: RabbitmqService, //private readonly redisService: RedisService,

  @MessagePattern('file-upload-queue')
  async uploadFile(@Payload() data: ProcessFileDto, @Ctx() context: RmqContext): Promise<void> {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const uploadDir = path.resolve(__dirname, '../../tmp');
      const filePath = path.join(uploadDir, `file-${data.uploadId}.csv`);

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

  @MessagePattern('process-file-queue')
  async readFile(data: CreateUserDto, context: RmqContext): Promise<void> {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.userService.create(data);
      chanel.ack(originalMsg);
    } catch {
      console.log(error);

      chanel.nack(originalMsg);
    }
  }
}
