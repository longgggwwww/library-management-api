import { Test, TestingModule } from '@nestjs/testing';
import { ReturnSlipController } from './return-slip.controller';
import { ReturnSlipService } from './return-slip.service';

describe('ReturnSlipController', () => {
  let controller: ReturnSlipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnSlipController],
      providers: [ReturnSlipService],
    }).compile();

    controller = module.get<ReturnSlipController>(ReturnSlipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
