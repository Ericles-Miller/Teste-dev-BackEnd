import {v4 as uuid} from 'uuid';

export class Base {
  id: string;
  createdAt!: Date;
  updatedAt: Date | null;
  enable!: boolean;

  constructor() {
    this.id = uuid();
    this.createdAt = new Date();
    this.enable = true;
    this.updatedAt = null;
  }

  
  setUpdatedAt(date: Date): void {
    this.updatedAt = new Date();
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }
}
