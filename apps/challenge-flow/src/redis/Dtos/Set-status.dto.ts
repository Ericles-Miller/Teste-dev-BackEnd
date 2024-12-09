import { EStatus } from "../../../../redis/src/status.enumarator";

export class SetStatusDto {
  jobId: string;
  status: EStatus;
}
