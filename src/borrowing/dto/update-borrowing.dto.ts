import { PartialType } from '@nestjs/mapped-types';
import { LoanTransactionDto } from './create-borrowing.dto';

export class UpdateBorrowingDto extends PartialType(LoanTransactionDto) {}
