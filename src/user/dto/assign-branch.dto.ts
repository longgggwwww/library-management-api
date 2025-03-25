import { IsInt } from 'class-validator';

// Gán branch cho user
export class AssignBranchDto {
  @IsInt()
  branchId: number;
}
