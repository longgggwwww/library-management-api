import { IsInt, IsNumber } from 'class-validator';

export class CreateBorrowingPolicyDto {
  @IsInt()
  maxBorrowDays: number; // Số ngày mượn tối đa

  @IsNumber()
  baseFee: number; // Phí mượn cố định

  @IsNumber()
  extensionFeePerDay: number; // Phí gia hạn mỗi ngày

  @IsInt()
  maxExtensions: number; // Số lần gia hạn tối đa
}
