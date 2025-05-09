import { Controller, Post, UseInterceptors, UploadedFile, Res, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerFileService } from './manager-file.service';
import { ApiBody, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { EStatusFile } from './status-file.enum';
import { ResponseProcessFileDto } from './dto/response-process-file.dto';

@Controller('Manager-file')
@ApiTags('manager-files')
export class ManagerFileController {
  constructor(private readonly managerFileService: ManagerFileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload file with info users',
    type: FileUploadDto,
  })
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() response): Promise<Response> {
    const uploadId = await this.managerFileService.uploadFile(file);

    return response.status(201).json({
      message: 'File received successfully. Processing started.',
      uploadId,
    });
  }

  @Get(':uploadId/status')
  @ApiOperation({ summary: 'Get file processing status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current status of file processing',
    schema: {
      type: 'object',
      properties: {
        uploadId: { type: 'string' },
        status: { type: 'string', enum: Object.values(EStatusFile) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Status not found for this uploadId' })
  async getFileStatus(@Param('uploadId') uploadId: string): Promise<ResponseProcessFileDto> {
    return await this.managerFileService.getStatusProcessFile(uploadId);
  }
}
