import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProcessFileDto } from 'apps/challenge-flow/src/redis/Dtos/process-file.dto';
import { CreateUserDto } from 'apps/challenge-flow/src/user/dto/create-user.dto';
import { UserService } from 'apps/challenge-flow/src/user/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RabbitMqService {
  constructor(private readonly userService: UserService) {}

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
      chanel.nack(originalMsg);
    }
  }
}
