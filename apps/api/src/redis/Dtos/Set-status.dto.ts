import { EStatus } from '../status.enum';

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
