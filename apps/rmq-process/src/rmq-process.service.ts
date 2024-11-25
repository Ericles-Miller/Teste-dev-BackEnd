import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RmqProcessService {
  async uploadFile(data: any, context: RmqContext): Promise<void> {
    try {
      const chanel = context.getChannelRef();
      const originalMSg = context.getMessage();

      const uploadDir = path.resolve(__dirname, '../../tmp');
      const fileName = `file-${Date.now()}.csv`;
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`File save with successfully: ${filePath}`);

      chanel.ack(originalMSg);
    } catch (error) {
      console.error(error);
    }
  }
}
