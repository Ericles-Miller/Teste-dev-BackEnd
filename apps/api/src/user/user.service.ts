import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AwsService } from '../aws/aws.service';
import { EStatusFile } from '../manager-file/status-file.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  async createMany(createUserDto: CreateUserDto[], uploadId: string): Promise<void> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(User, createUserDto);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
      throw error;
    } finally {
      await queryRunner.release();
      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessCompleted);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
