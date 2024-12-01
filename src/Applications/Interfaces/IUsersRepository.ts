import { Users } from '@prisma/client';

import { IBaseRepository } from './shared/IBaseRepository';

export interface IUsersRepository extends IBaseRepository<Users> {
  checkEmailAlreadyExist(email: string) : Promise<Users | null>,
  setUserTrue(id: string): Promise<void>
}