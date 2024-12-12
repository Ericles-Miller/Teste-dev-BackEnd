import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';

export async function validateDto(data: any): Promise<CreateUserDto | null> {
  const dto = plainToInstance(CreateUserDto, data);
  const errors = await validate(dto);

  if (errors.length > 0) {
    console.error('Validation failed:', errors);
    return null;
  }
  return dto;
}
