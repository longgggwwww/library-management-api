import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMembershipGroupDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsInt()
  maxBorrowedItems: number;

  @IsInt()
  maxBorrowDays: number;

  @IsInt()
  maxBorrowRequests: number;

  @IsString()
  @IsOptional()
  description: string;
}
