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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Các endpoint này sẽ được bảo vệ bởi BranchAccessGuard
// Điều này có nghĩa là người dùng cần phải có quyền truy cập vào branch mới có thể truy cập vào các endpoint này
@UseGuards(BranchAccessGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  // Endpoint này sẽ tìm kiếm nhiều category theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('branch/:branch_id')
  findByBranch(@Param('branch_id', ParseIntPipe) branchId: number) {
    return this.category.findMany(branchId);
  }

  //--------------Các endpoint dưới đây sẽ được bảo vệ bởi quyền truy cập----------------

  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateCategoryDto) {
    return this.category.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm một category theo id
  @Get()
  findMany(
    // Thêm decorator @UserCtx() để lấy thông tin người dùng
    @UserCtx() user: User,
  ) {
    return this.category.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm kiếm một category theo ID
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.category.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật thông tin một category
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.category.update(user.branchId, id, dto);
  }

  // Endpoint này sẽ xóa nhiều category cùng lúc
  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    // Sử dụng decorator ParseArrayPipe để chuyển đổi chuỗi thành mảng số
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.category.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một category theo ID
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.category.delete(user.branchId, id);
  }
}
