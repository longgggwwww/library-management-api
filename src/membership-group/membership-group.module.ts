import { Module } from '@nestjs/common';
import { MembershipGroupController } from './membership-group.controller';
import { MembershipGroupService } from './membership-group.service';

@Module({
  controllers: [MembershipGroupController],
  providers: [MembershipGroupService],
})
export class MembershipGroupModule {}
