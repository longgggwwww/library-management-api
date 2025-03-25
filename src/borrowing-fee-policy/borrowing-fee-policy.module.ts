import { Module } from '@nestjs/common';
import { BorrowingFeePolicyService } from './borrowing-fee-policy.service';
import { BorrowingFeePolicyController } from './borrowing-fee-policy.controller';

@Module({
  controllers: [BorrowingFeePolicyController],
  providers: [BorrowingFeePolicyService],
})
export class BorrowingFeePolicyModule {}
