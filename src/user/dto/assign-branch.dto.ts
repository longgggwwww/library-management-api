import { IsInt } from 'class-validator';

export class AssignBranchDto {
  @IsInt()
  branchId: number;
}
