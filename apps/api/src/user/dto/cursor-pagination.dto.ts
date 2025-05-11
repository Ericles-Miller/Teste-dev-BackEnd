import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CursorPaginationDto {
  @ApiProperty({ required: false, description: 'ID do último registro da página anterior' })
  @IsOptional()
  @IsString()
  lastId?: string;

  @ApiProperty({ required: false, description: 'Número de registros por página', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit?: number = 20;

  @ApiProperty({
    required: false,
    description: 'Campo para ordenação',
    enum: ['id', 'givName', 'city', 'tropicalZodiac', 'occupation', 'vehicle', 'countryFull'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'givName', 'city', 'tropicalZodiac', 'occupation', 'vehicle', 'countryFull'])
  orderBy?: string = 'id';

  @ApiProperty({
    required: false,
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'ASC';
}
