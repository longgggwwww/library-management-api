import { Module } from '@nestjs/common';
import { BorrowingPolicyService } from './borrowing-policy.service';
import { BorrowingPolicyController } from './borrowing-policy.controller';

@Module({
  controllers: [BorrowingPolicyController],
  providers: [BorrowingPolicyService],
})
export class BorrowingPolicyModule {}
