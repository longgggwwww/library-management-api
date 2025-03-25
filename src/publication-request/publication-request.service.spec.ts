import { Test, TestingModule } from '@nestjs/testing';
import { PublicationRequestService } from './publication-request.service';

describe('PublicationRequestService', () => {
  let service: PublicationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationRequestService],
    }).compile();

    service = module.get<PublicationRequestService>(PublicationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
