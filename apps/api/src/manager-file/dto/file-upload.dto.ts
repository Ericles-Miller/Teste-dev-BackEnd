import { ApiProperty } from '@nestjs/swagger';
import { IsFile, MaxFileSize, HasMimeType } from 'nestjs-form-data';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsFile()
  @MaxFileSize(10e9)
  @HasMimeType(['text/csv'])
  file: Express.Multer.File;
}
