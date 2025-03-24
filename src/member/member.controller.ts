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
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

// BranchAccessGuard sẽ kiểm tra quyền truy cập vào branch của người dùng
@UseGuards(BranchAccessGuard)
@Controller('members')
export class MemberController {
  constructor(private readonly member: MemberService) {}

  // Endpoint này sẽ tạo mới một member
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateMemberDto,
  ) {
    return this.member.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều member theo branch
  @Get()
  findMany(@UserCtx() user: User) {
    return this.member.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm kiếm một member
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.member.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật một member
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.member.update(user.branchId, id, dto);
  }

  // Endpoint này sẽ xóa nhiều member
  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.member.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một member
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.member.delete(user.branchId, id);
  }
}
