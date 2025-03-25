import { Module } from '@nestjs/common';
import { ReturnSlipService } from './return-slip.service';
import { ReturnSlipController } from './return-slip.controller';

@Module({
  controllers: [ReturnSlipController],
  providers: [ReturnSlipService],
})
export class ReturnSlipModule {}
