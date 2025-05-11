import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from './dto/pagination-response.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { FilterDto } from './dto/filter.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários com paginação baseada em cursor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários paginada',
    type: PaginatedResponseDto<User>,
  })
  @ApiQuery({ type: CursorPaginationDto })
  @ApiQuery({ type: FilterDto })
  async findAll(
    @Query() pagination: CursorPaginationDto,
    @Query() filters: FilterDto,
  ): Promise<PaginatedResponseDto<User>> {
    return await this.userService.findAll(pagination, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
