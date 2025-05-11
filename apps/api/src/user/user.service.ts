import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AwsService } from '../aws/aws.service';
import { EStatusFile } from '../manager-file/status-file.enum';
import { PaginatedResponseDto } from './dto/pagination-response.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  async createMany(
    createUserDto: CreateUserDto[],
    uploadId: string,
    isLastBatch: boolean = false,
  ): Promise<void> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(User, createUserDto);
      await queryRunner.commitTransaction();

      if (isLastBatch) {
        await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessCompleted);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.awsService.publishProcessStatus(uploadId, EStatusFile.ProcessError);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private validateLastId(lastId: string, orderBy: string): string | number {
    // Se o campo de ordenação for 'id', o lastId deve ser um número
    if (orderBy === 'id') {
      const numericId = Number(lastId);
      if (isNaN(numericId)) {
        throw new BadRequestException(`O valor do lastId deve ser um número quando orderBy é 'id'`);
      }
      return numericId;
    }
    return lastId;
  }

  async findAll(pagination: CursorPaginationDto, filters: FilterDto): Promise<PaginatedResponseDto<User>> {
    const startTime = Date.now();
    const limit = pagination.limit || 20;
    const orderBy = pagination.orderBy || 'id';
    const orderDirection = pagination.orderDirection || 'ASC';

    // Construir a query base
    let query = this.userRepository.createQueryBuilder('user');

    // Aplicar filtros
    if (filters.givenName)
      query = query.andWhere('user.givName ILIKE :givenName', { givenName: `%${filters.givenName}%` });

    if (filters.city) query = query.andWhere('user.city ILIKE :city', { city: `%${filters.city}%` });

    if (filters.tropicalZodiac)
      query = query.andWhere('user.tropicalZodiac ILIKE :tropicalZodiac', {
        tropicalZodiac: `%${filters.tropicalZodiac}%`,
      });

    if (filters.occupation)
      query = query.andWhere('user.occupation ILIKE :occupation', { occupation: `%${filters.occupation}%` });

    if (filters.vehicle)
      query = query.andWhere('user.vehicle ILIKE :vehicle', { vehicle: `%${filters.vehicle}%` });

    if (filters.countryFull)
      query = query.andWhere('user.countryFull ILIKE :countryFull', {
        countryFull: `%${filters.countryFull}%`,
      });

    // Aplicar cursor se existir
    if (pagination.lastId) {
      const validatedLastId = this.validateLastId(pagination.lastId, orderBy);

      if (orderDirection === 'ASC') {
        query = query.andWhere(`user.${orderBy} > :lastId`, { lastId: validatedLastId });
      } else {
        query = query.andWhere(`user.${orderBy} < :lastId`, { lastId: validatedLastId });
      }
    }

    // Aplicar ordenação e limite
    query = query.orderBy(`user.${orderBy}`, orderDirection).take(limit + 1);

    // Executar a query
    const results = await query.getMany();
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    const executionTime = Date.now() - startTime;

    // Pegar o último item para o cursor
    const lastItem = data[data.length - 1];
    const nextCursor = hasMore ? lastItem[orderBy] : undefined;

    return {
      data,
      nextCursor,
      hasMore,
      currentCount: data.length,
      executionTime,
      paginationInfo: {
        orderBy,
        orderDirection,
        nextPageUrl: hasMore
          ? `/users?limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}&lastId=${nextCursor}`
          : undefined,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
