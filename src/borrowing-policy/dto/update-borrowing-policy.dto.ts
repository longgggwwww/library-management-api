import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowingPolicyDto } from './create-borrowing-policy.dto';

export class UpdateBorrowingPolicyDto extends PartialType(CreateBorrowingPolicyDto) {}
