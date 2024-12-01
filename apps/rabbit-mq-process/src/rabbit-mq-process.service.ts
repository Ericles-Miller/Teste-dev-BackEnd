import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RabbitMqProcessService {
  @MessagePattern('file-upload-queue')
  async fileProcess(@Payload() data: any, @Ctx() context: RmqContext): Promise<void> {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(data);

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
}
