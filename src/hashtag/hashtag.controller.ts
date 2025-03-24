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
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { HashtagService } from './hashtag.service';

// Các endpoint trong controller này sẽ được bảo vệ bởi BranchAccessGuard
@UseGuards(BranchAccessGuard)
@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashtag: HashtagService) {}

  // Endpoint này sẽ tìm kiếm nhiều hashtag theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('publication/:publication_id')
  findByPub(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
    @Param('publication_id', ParseIntPipe) pubId: number,
  ) {
    return this.hashtag.findByPub(user.branchId, pubId);
  }

  // --------------Các endpoint dưới đây sẽ được bảo vệ bởi quyền truy cập----------------

  // Endpoint này sẽ tạo mới một hashtag
  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateHashtagDto) {
    return this.hashtag.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều hashtag theo branch
  @Get()
  findMany(@UserCtx() user: User) {
    return this.hashtag.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm một hashtag theo id
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.hashtag.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật thông tin một hashtag
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHashtagDto,
  ) {
    return this.hashtag.update(user.branchId, id, dto);
  }

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
    return this.hashtag.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một hashtag
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.hashtag.delete(user.branchId, id);
  }
}
