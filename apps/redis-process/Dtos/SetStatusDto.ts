import { EStatus } from '../src/EStatus.enumerator';

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
