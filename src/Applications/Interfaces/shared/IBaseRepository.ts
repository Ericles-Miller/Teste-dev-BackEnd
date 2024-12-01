export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<void>;
  listAll(): Promise<T[]>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<void>;
  findManyById(id: string): Promise<T[]>;
}