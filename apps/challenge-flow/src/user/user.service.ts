import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
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

    await this.repository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
