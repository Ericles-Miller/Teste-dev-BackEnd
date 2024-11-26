import { EStatus } from '../status.enumerator';

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
