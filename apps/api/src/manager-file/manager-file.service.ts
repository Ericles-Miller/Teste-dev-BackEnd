import { RabbitmqService } from '@api/rabbitmq/rabbitmq.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ManagerFileService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async uploadFile(file: any): Promise<string> {
    const uploadId = uuid();

    this.rabbitmqService.instance.emit('file-upload-queue', {
      uploadId,
      fileName: file.originalname,
      fileBuffer: file.buffer.toString('base64'),
    });

    // vou chamar para ler o arquivo e consumilo
    // setar o staus do redis
    return uploadId;
  }

  findOne(id: number) {
    return `This action returns a #${id} ManagerFile`;
  }
}
