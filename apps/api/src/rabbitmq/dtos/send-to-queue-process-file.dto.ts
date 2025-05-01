import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SendToQueueProcessFileDto {
  uploadId: string;
  batch: CreateUserDto[];
}
