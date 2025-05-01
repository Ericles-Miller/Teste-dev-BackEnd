import { CreateUserDto } from '../../user/dto/create-user.dto';

export class SendToQueueProcessFileDto {
  uploadId: string;
  batch: CreateUserDto[];
}
