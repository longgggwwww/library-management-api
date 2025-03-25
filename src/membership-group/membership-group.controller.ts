import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { PublicBranch } from 'src/branch/decorators/public-branch.decorator';
import { CreateMembershipGroupDto } from './dto/create-membership-group.dto';
import { UpdateMemberGroupDto } from './dto/update-membership-group.dto';
import { MembershipGroupService } from './membership-group.service';

@UseGuards(BranchAccessGuard)
@Controller('membership-groups')
export class MembershipGroupController {
  constructor(private readonly membershipGroup: MembershipGroupService) {}

  @PublicBranch()
  @Get('branch_id/public')
  findPublic(@Param('branch_id', ParseIntPipe) branchId: number) {
    return this.membershipGroup.findMany(branchId);
  }

  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateMembershipGroupDto) {
    return this.membershipGroup.create(user.branchId, dto);
  }

  @Get()
  findMany(@UserCtx() user: User) {
    return this.membershipGroup.findMany(user.branchId);
  }

  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.membershipGroup.find(user.branchId, id);
  }

  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberGroupDto,
  ) {
    return this.membershipGroup.update(user.branchId, id, dto);
  }

  @Delete('batch')
  deleteMany(
    @UserCtx() user: User,
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.membershipGroup.deleteMany(user.branchId, ids);
  }

  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.membershipGroup.delete(user.branchId, id);
  }
}
