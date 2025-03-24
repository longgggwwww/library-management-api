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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

// Các endpoint trong controller này sẽ được bảo vệ bởi BranchAccessGuard
// Điều này có nghĩa là người dùng cần phải có quyền truy cập vào branch mới có thể truy cập vào các endpoint này
@UseGuards(BranchAccessGuard)
@Controller('classes')
export class ClassController {
  constructor(private readonly classSvc: ClassService) {}

  // Endpoint này sẽ tìm kiếm nhiều lớp học theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('branch_id/public')
  findPublic(@Param('branch_id', ParseIntPipe) branchId: number) {
    return this.classSvc.findMany(branchId);
  }

  // Endpoint này sẽ tạo mới một lớp học
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateClassDto,
  ) {
    return this.classSvc.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều lớp học theo branch
  @Get()
  findMany(@UserCtx() user: User) {
    return this.classSvc.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm kiếm một lớp học
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.classSvc.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật một lớp học
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassDto,
  ) {
    return this.classSvc.update(user.branchId, id, dto);
  }

  // Endpoint này sẽ xóa nhiều lớp học
  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    // Lấy mảng các id từ query
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.classSvc.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một lớp học
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.classSvc.delete(user.branchId, id);
  }
}
