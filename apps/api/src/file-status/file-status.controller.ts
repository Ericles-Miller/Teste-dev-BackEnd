import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { FileStatusService } from './file-status.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseProcessFileDto } from '../manager-file/response-process-file.dto';

@ApiTags('File Status')
@Controller('file-status')
export class FileStatusController {
  constructor(private readonly fileStatusService: FileStatusService) {}

  @Get(':uploadId')
  @ApiOperation({ summary: 'Obter status de processamento de um arquivo' })
  @ApiParam({ name: 'uploadId', description: 'ID do upload' })
  @ApiResponse({
    status: 200,
    description: 'Status do processamento',
    type: ResponseProcessFileDto,
  })
  @ApiResponse({ status: 404, description: 'Status não encontrado' })
  async getFileStatus(@Param('uploadId') uploadId: string): Promise<ResponseProcessFileDto> {
    const status = await this.fileStatusService.getFileStatus(uploadId);

    if (!status) {
      throw new NotFoundException(`Status para uploadId=${uploadId} não encontrado`);
    }

    return status;
  }
}
