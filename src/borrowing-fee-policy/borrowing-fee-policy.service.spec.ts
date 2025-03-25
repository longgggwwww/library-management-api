import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingFeePolicyService } from './borrowing-fee-policy.service';

describe('BorrowingFeePolicyService', () => {
  let service: BorrowingFeePolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowingFeePolicyService],
    }).compile();

    service = module.get<BorrowingFeePolicyService>(BorrowingFeePolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
