import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowingFeePolicyDto } from './create-borrowing-fee-policy.dto';

export class UpdateBorrowingFeePolicyDto extends PartialType(CreateBorrowingFeePolicyDto) {}
