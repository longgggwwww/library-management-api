import { Test, TestingModule } from '@nestjs/testing';
import { PublicationRequestController } from './publication-request.controller';
import { PublicationRequestService } from './publication-request.service';

describe('PublicationRequestController', () => {
  let controller: PublicationRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationRequestController],
      providers: [PublicationRequestService],
    }).compile();

    controller = module.get<PublicationRequestController>(PublicationRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
