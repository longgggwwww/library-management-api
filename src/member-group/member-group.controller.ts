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
import { CreateMemberGroupDto } from './dto/create-member-group.dto';
import { UpdateMemberGroupDto } from './dto/update-member-group.dto';
import { MemberGroupService } from './member-group.service';

@UseGuards(BranchAccessGuard)
@Controller('member-groups')
export class MemberGroupController {
  constructor(private readonly memberGroup: MemberGroupService) {}

  // Endpoint này sẽ tìm kiếm nhiều member group theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('branch_id/public')
  findPublic(@Param('branch_id', ParseIntPipe) branchId: number) {
    return this.memberGroup.findMany(branchId);
  }

  // Endpoint này sẽ tạo mới một member group
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateMemberGroupDto,
  ) {
    return this.memberGroup.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều member group theo branch
  @Get()
  findMany(@UserCtx() user: User) {
    return this.memberGroup.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm kiếm một member group
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.memberGroup.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật một member group
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberGroupDto,
  ) {
    return this.memberGroup.update(user.branchId, id, dto);
  }

  // Endpoint này sẽ xóa nhiều member group
  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    // ParseArrayPipe sẽ chuyển chuỗi thành mảng
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.memberGroup.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một member group
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.memberGroup.delete(user.branchId, id);
  }
}
