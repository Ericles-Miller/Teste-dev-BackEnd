import { EStatus } from 'apps/redis/src/status.enumarator';

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
