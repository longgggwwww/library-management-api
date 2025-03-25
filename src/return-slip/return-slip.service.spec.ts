import { Test, TestingModule } from '@nestjs/testing';
import { ReturnSlipService } from './return-slip.service';

describe('ReturnSlipService', () => {
  let service: ReturnSlipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnSlipService],
    }).compile();

    service = module.get<ReturnSlipService>(ReturnSlipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
