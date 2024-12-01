import { IUsersRepository } from "@Applications/Interfaces/IUsersRepository";
import { prisma } from "@Infra/Data/database";
import { BaseRepository } from "@Infra/repositories/shared/BaseRepository";
import { UsersRepository } from "@Infra/repositories/UsersRepository";
import { PrismaClient, Users } from "@prisma/client";
import { Container } from "inversify";

export const container = new Container();

/// prisma 
container.bind<PrismaClient>('PrismaClient').toConstantValue(prisma);
container.bind<BaseRepository<Users>>('UsersRepository').to(UsersRepository);

/// interfaces 
container.bind<IUsersRepository>(UsersRepository).toSelf().inSingletonScope();
