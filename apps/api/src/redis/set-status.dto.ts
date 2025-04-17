import { EStatus } from 'apps/redis-process/src/status.enumerator';

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
