import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

// Các endpoint trong controller này sẽ được bảo vệ bởi BranchAccessGuard
// BranchAccessGuard sẽ kiểm tra quyền truy cập vào branch của người dùng
@UseGuards(BranchAccessGuard)
@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  // Endpoint này sẽ tạo mới một inventory
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateInventoryDto,
  ) {
    return this.inventory.create(user.branchId, dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều inventory theo branch
  @Get()
  findMany(@UserCtx() user: User) {
    return this.inventory.findMany(user.branchId);
  }

  // Endpoint này sẽ tìm kiếm một inventory
  @Get(':id')
  findOne(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.inventory.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật một inventory
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserCtx() user: User,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventory.update(user.branchId, id, updateInventoryDto);
  }

  // Endpoint này sẽ xóa nhiều inventory
  @Delete('batch')
  deleteBatch(@UserCtx() user: User, @Body() ids: number[]) {
    return this.inventory.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một inventory
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.inventory.delete(user.branchId, id);
  }
}
