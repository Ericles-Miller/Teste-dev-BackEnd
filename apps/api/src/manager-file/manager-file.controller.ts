import { Controller, Post, UseInterceptors, UploadedFile, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerFileService } from './manager-file.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('Manager-file')
@ApiTags('manager-files')
export class ManagerFileController {
  constructor(private readonly managerFileService: ManagerFileService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(new BadRequestException('Apenas arquivos CSV são permitidos'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo CSV com dados de usuários',
    type: FileUploadDto,
  })
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() response): Promise<Response> {
    if (!file) throw new BadRequestException('Nenhum arquivo foi enviado');

    const uploadId = await this.managerFileService.processStream(file);

    return response.status(201).json({
      message: 'Arquivo CSV recebido com sucesso. Processamento iniciado.',
      uploadId,
    });
  }
}
