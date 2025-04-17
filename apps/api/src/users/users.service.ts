import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({
    city,
    countryFull,
    emailAddress,
    gender,
    givName,
    id,
    nameSet,
    occupation,
    streetAddress,
    surName,
    title,
    tropicalZodiac,
    vehicle,
  }: CreateUserDto): Promise<void> {
    const user = new User(
      id,
      gender,
      nameSet,
      title,
      givName,
      surName,
      streetAddress,
      city,
      emailAddress,
      tropicalZodiac,
      occupation,
      vehicle,
      countryFull,
    );

    await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
