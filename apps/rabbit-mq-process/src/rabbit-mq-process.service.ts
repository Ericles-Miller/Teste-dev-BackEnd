import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from '@aws-sdk/client-sqs';
import { config } from './config';
import { UserService } from 'apps/api/src/user/user.service';
import { CreateUserDto } from 'apps/api/src/user/dto/create-user.dto';
import { EStatus } from 'apps/api/src/redis/status.enum';
import { RedisService } from 'apps/api/src/redis/redis.service';

interface ISqsMessageBody {
  batch: string[];
}

@Injectable()
export class RabbitMqProcessService {
  private readonly MAX_RETRIES = 3;
  private readonly BACKOFF_TIME = 1000;

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  private async processWithRetry(batch: CreateUserDto[], retryCount = 0): Promise<void> {
    try {
      await this.userService.createMany(batch);
    } catch (error) {
      if (retryCount >= this.MAX_RETRIES) throw error;

      await new Promise((resolve) => setTimeout(resolve, this.BACKOFF_TIME * Math.pow(2, retryCount)));

      return this.processWithRetry(batch, retryCount + 1);
    }
  }

  @SqsMessageHandler(config.queue, false)
  async fileProcess(message: AWS.Message): Promise<void> {
    const { batch }: ISqsMessageBody = JSON.parse(message.Body);

    const dtos: CreateUserDto[] = batch.map((row) => {
      const [
        id,
        gender,
        nameSet,
        title,
        givName,
        surName,
        streetAddress,
        city,
        emailAddress,
        tropicalZodiac,
        occupation,
        vehicle,
        countryFull,
      ] = row.split(',');

      return {
        id: parseInt(id, 10),
        gender,
        nameSet,
        title,
        givName,
        surName,
        streetAddress,
        city,
        emailAddress,
        tropicalZodiac,
        occupation,
        vehicle,
        countryFull,
      } as CreateUserDto;
    });

    try {
      await this.processWithRetry(dtos);
      this.redisService.instance.emit('set-status', EStatus.PROCESS);
    } catch (error) {
      console.error('Erro ao processar batch:', error);
      this.redisService.instance.emit('set-status', EStatus.ERROR);
      throw error;
    }
  }
}
