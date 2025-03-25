import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateBorrowingSlipDto {
  @IsString()
  code: string; // Mã phiếu mượn sách

  @IsInt()
  borrowerId: number; // ID người mượn sách

  @IsDate()
  borrowingDate: Date; // Ngày mượn sách

  @IsDate()
  dueDate: Date; // Ngày phải trả sách

  @IsString()
  @IsOptional()
  note?: string; // Ghi chú (tùy chọn)

  @IsArray()
  @ArrayMinSize(1) // Ensure at least one item is present
  @ValidateNested({ each: true })
  @Type(() => LoanTransactionDto)
  borrowings: LoanTransactionDto[]; // Danh sách sách mượn
}

export class LoanTransactionDto {
  @IsString()
  @IsOptional()
  code?: string; // Mã của transaction

  @IsInt()
  itemId: number; // ID sách

  @IsNumber()
  @IsOptional()
  borrowingFee?: number; // Phí mượn sách (nếu cần)
}
