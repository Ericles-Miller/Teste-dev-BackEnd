import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as fs from 'fs';
import * as path from 'path';
import * as AWS from '@aws-sdk/client-sqs';
import { config } from './config';

@Injectable()
export class RabbitMqProcessService {
  @SqsMessageHandler(config.queue, false)
  async fileProcess(message: AWS.Message): Promise<void> {
    const { uploadId } = JSON.parse(message.Body);

    try {
      console.log(uploadId);

      const uploadDir = path.resolve(__dirname, '../../tmp');
      const filePath = path.join(uploadDir, `file-${uploadId}.csv`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      //await fs.promises.writeFile(filePath, JSON.stringify(fileBuffer, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
}
