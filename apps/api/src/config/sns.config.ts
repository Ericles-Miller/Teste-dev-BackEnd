import { PublishCommand, SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import { EStatusFile } from '../manager-file/status-file.enum';
import { InternalServerErrorException } from '@nestjs/common';

export class SnsConfig extends SNSClient {
  /**
   * Inicializa o cliente SNS com as configurações apropriadas para o ambiente
   * Em desenvolvimento, usa o endpoint local (ex: localstack)
   * Em produção, usa o serviço SNS da AWS
   */
  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const config: SNSClientConfig = {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      region: process.env.AWS_REGION || 'us-east-1',
    };

    if (isDevelopment) {
      config.endpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
    }

    super(config);
  }

  /**
   * Publica uma atualização de status de processamento de arquivo no tópico SNS
   * @param uploadId - ID único do upload sendo processado
   * @param status - Status atual do processamento (enum EStatusFile)
   * @returns MessageId da mensagem publicada no SNS
   */
  async publishProcessStatus(uploadId: string, status: EStatusFile): Promise<string> {
    const topicArn = process.env.AWS_SNS_TOPIC_ARN;

    if (!topicArn) {
      throw new InternalServerErrorException('Error to configure SNS');
    }

    const message = {
      uploadId,
      status,
    };

    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
      MessageAttributes: {
        uploadId: {
          DataType: 'String',
          StringValue: uploadId,
        },
        status: {
          DataType: 'String',
          StringValue: status,
        },
      },
    });

    const response = await this.send(command);
    return response.MessageId;
  }
}
