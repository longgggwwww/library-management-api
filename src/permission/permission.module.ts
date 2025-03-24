import { Module } from '@nestjs/common';
import { PermController } from './permission.controller';
import { PermService } from './permission.service';

@Module({
  controllers: [PermController],
  providers: [PermService],
})
export class PermModule {}
