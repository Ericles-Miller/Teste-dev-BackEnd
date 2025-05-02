import { Controller, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerFileService } from './manager-file.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

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
}
