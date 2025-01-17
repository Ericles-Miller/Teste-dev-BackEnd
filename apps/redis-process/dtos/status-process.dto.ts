import { EStatus } from 'apps/redis-process/status.enum';

export class StatusProcessDto {
  key: string;
  status: EStatus;
}
