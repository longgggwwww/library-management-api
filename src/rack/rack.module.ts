import { Module } from '@nestjs/common';
import { RackService } from './rack.service';
import { RackController } from './rack.controller';

@Module({
  controllers: [RackController],
  providers: [RackService],
})
export class RackModule {}
