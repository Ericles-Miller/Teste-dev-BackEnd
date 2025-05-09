import { ApiProperty } from '@nestjs/swagger';
import { EStatusFile } from '../status-file.enum';

export class ResponseProcessFileDto {
  @ApiProperty()
  uploadId: string;

  @ApiProperty()
  status: EStatusFile;
}
