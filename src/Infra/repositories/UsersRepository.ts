
import { PrismaClient, Users } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { BaseRepository } from './shared/BaseRepository';
import { IUsersRepository } from '@Applications/Interfaces/IUsersRepository';
import { prisma } from '@Infra/Data/database';

@injectable()
export class UsersRepository extends BaseRepository<Users> implements IUsersRepository {
  constructor(
    @inject('PrismaClient')
      prisma: PrismaClient,
  ) {
    super(prisma.users);
  }


  async checkEmailAlreadyExist(email: string) : Promise<Users|null> {
    const user = await prisma.users.findFirst({ where: { email } });

    return user;
  }

  async setUserTrue(id: string): Promise<void> {
    await prisma.users.update({ where: { id }, data: { enable: true } });
  }
}
