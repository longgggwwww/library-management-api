import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingFeePolicyController } from './borrowing-fee-policy.controller';
import { BorrowingFeePolicyService } from './borrowing-fee-policy.service';

describe('BorrowingFeePolicyController', () => {
  let controller: BorrowingFeePolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingFeePolicyController],
      providers: [BorrowingFeePolicyService],
    }).compile();

    controller = module.get<BorrowingFeePolicyController>(BorrowingFeePolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
