import { Controller, Get, Post, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerFileService } from './manager-file.service';
import { ApiBody, ApiConsumes, ApiExtension, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('Manager-file')
@ApiTags('manager-files')
export class ManagerFileController {
  constructor(private readonly managerFileService: ManagerFileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List Of users',
    type: FileUploadDto,
  })
  @ApiExtension('x-csv', { hello: 'world' })
  @Post()
  uploadFile(@UploadedFile() file) {
    return this.managerFileService.uploadFile(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerFileService.findOne(+id);
  }
}
