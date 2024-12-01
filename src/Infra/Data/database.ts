import { PrismaClient, Test, Users } from "@prisma/client";

export const { test, users } = new PrismaClient();
export const prisma = new PrismaClient();

export type RepositoryType<T> = T extends Users
  ? PrismaClient['users']
  : T extends Test
  ? PrismaClient['test']
  : never;

export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

