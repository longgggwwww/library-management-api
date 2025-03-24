import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MemberGroupController } from './member-group.controller';
import { MemberGroupService } from './member-group.service';

@Module({
  controllers: [MemberGroupController],
  providers: [MemberGroupService, PrismaService],
})
export class MemberGroupModule {}
