import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseProcessFileDto } from '../manager-file/response-process-file.dto';

@Injectable()
export class FileStatusService implements OnModuleInit {
  // Simulação do Redis para desenvolvimento
  private statusStorage: Map<string, string> = new Map();

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Aqui você inicializaria o cliente Redis em um ambiente real
    // this.redisClient = new Redis({...});
  }

  /**
   * Processa uma notificação de status recebida do SNS
   * Em produção, esta seria uma função Lambda separada
   */
  async processStatusNotification(message: any): Promise<void> {
    try {
      const { uploadId, status, timestamp } = message;

      // Armazenar o status (simulando Redis)
      this.statusStorage.set(`file-status:${uploadId}`, JSON.stringify({ status, timestamp }));

      console.log(`Status atualizado para uploadId=${uploadId}, status=${status}`);
    } catch (error) {
      console.error('Erro ao processar notificação de status:', error);
      throw error;
    }
  }

  /**
   * Obtém o status de processamento de um arquivo
   */
  async getFileStatus(uploadId: string): Promise<ResponseProcessFileDto> {
    const statusData = this.statusStorage.get(`file-status:${uploadId}`);

    if (!statusData) {
      return null;
    }

    return JSON.parse(statusData);
  }
}
