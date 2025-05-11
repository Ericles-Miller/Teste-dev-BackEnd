import { ApiProperty } from '@nestjs/swagger';

export class PaginationInfoDto {
  @ApiProperty({ description: 'Campo usado para ordenação' })
  orderBy: string;

  @ApiProperty({ description: 'Direção da ordenação (ASC/DESC)' })
  orderDirection: 'ASC' | 'DESC';

  @ApiProperty({ description: 'URL para a próxima página', required: false })
  nextPageUrl?: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ description: 'Valor do cursor para a próxima página' })
  nextCursor?: string;

  @ApiProperty({ description: 'Indica se existem mais páginas' })
  hasMore: boolean;

  @ApiProperty({ description: 'Quantidade de registros na página atual' })
  currentCount: number;

  @ApiProperty({ description: 'Tempo de execução em milissegundos' })
  executionTime: number;

  @ApiProperty({ description: 'Informações sobre a paginação' })
  paginationInfo: PaginationInfoDto;
}
