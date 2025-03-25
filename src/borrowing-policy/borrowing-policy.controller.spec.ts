import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingPolicyController } from './borrowing-policy.controller';
import { BorrowingPolicyService } from './borrowing-policy.service';

describe('BorrowingPolicyController', () => {
  let controller: BorrowingPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingPolicyController],
      providers: [BorrowingPolicyService],
    }).compile();

    controller = module.get<BorrowingPolicyController>(BorrowingPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
