import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingPolicyService } from './borrowing-policy.service';

describe('BorrowingPolicyService', () => {
  let service: BorrowingPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowingPolicyService],
    }).compile();

    service = module.get<BorrowingPolicyService>(BorrowingPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
