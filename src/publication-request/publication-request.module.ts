import { Module } from '@nestjs/common';
import { PublicationRequestService } from './publication-request.service';
import { PublicationRequestController } from './publication-request.controller';

@Module({
  controllers: [PublicationRequestController],
  providers: [PublicationRequestService],
})
export class PublicationRequestModule {}
