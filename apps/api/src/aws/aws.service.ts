import { Injectable, OnModuleInit } from '@nestjs/common';
import { EStatusFile } from '../manager-file/status-file.enum';
import { SnsConfig } from '../config/sns.config';
import { FileStatusService } from '../file-status/file-status.service';

@Injectable()
export class AwsService implements OnModuleInit {
  constructor(
    private readonly snsConfig: SnsConfig,
    private readonly fileStatusService: FileStatusService,
  ) {}

  async onModuleInit() {
    // Simular o comportamento de um Lambda assinando o tópico SNS
    // Em produção, isso seria feito pela infraestrutura AWS
    // Aqui você poderia implementar um mecanismo para receber as notificações
    // Como estamos em desenvolvimento, vamos apenas simular isso
  }

  async publishProcessStatus(uploadId: string, status: EStatusFile): Promise<string> {
    const messageId = await this.snsConfig.publishProcessStatus(uploadId, status);

    await this.fileStatusService.processStatusNotification({
      uploadId,
      status,
      timestamp: new Date().toISOString(),
    });

    return messageId;
  }
}
