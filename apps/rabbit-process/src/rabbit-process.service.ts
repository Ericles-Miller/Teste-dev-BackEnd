import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from 'apps/api/src/redis/redis.service';
import { EStatus } from 'apps/api/src/redis/status.enum';
import { CreateUserDto } from 'apps/api/src/user/dto/create-user.dto';
import { UserService } from 'apps/api/src/user/user.service';

@Injectable()
export class RabbitProcessService {
  constructor(
    private readonly userService: UserService,

    private readonly redisService: RedisService,
  ) {}

  async processData({ batch, id }): Promise<void> {
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
      await this.processWithRetry(dtos, id);
      this.redisService.instance.emit('set-status', { status: EStatus.PROCESS, id });
    } catch (error) {
      console.error('Error to process batch:', error);
      this.redisService.instance.emit('set-status', { status: EStatus.ERROR, id });
      throw error;
    }
  }

  private async processWithRetry(batch: CreateUserDto[], id: string): Promise<void> {
    try {
      await this.userService.createMany(batch);
    } catch (error) {
      this.redisService.instance.emit('set-status', { status: EStatus.ERROR, id });

      throw new InternalServerErrorException(error);
    }
  }
}
