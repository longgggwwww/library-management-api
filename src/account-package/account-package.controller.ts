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
import { PublicEndpoint } from 'src/auth/decorators/public-endpoint.decorator';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { Permit } from 'src/permission/decorators/permit.decorator';
import { AccountPackageService } from './account-package.service';
import { CreateAccountPackageDto } from './dto/create-account-package.dto';
import { UpdateAccountPackageDto } from './dto/update-account-package.dto';

@UseGuards(BranchAccessGuard)
@Controller('account-packages') // Các route liên quan đến phí dịch vụ
export class AccountPackageController {
  constructor(private readonly accountPkg: AccountPackageService) {}

  // Tạo mới một phí dịch vụ
  @Permit('CREATE_ACCOUNT_PACKAGE')
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator @UserCtx()
    @UserCtx() user: User,
    @Body() dto: CreateAccountPackageDto,
  ) {
    return this.accountPkg.create(user.branchId, dto);
  }

  // Tìm kiếm nhiều phí dịch vụ theo các tiêu chí
  @PublicEndpoint() // Endpoint này không cần quyền truy cập
  @Get('search')
  search(@UserCtx() user: User, @Query() query: any) {
    return this.accountPkg.search(user.branchId, query);
  }

  // Tìm kiếm nhiều phí dịch vụ
  @Permit('VIEW_ACCOUNT_PACKAGE')
  @Get()
  findMany(@UserCtx() user: User) {
    return this.accountPkg.findMany(user.branchId);
  }

  // Tìm kiếm một phí dịch vụ
  @Permit('VIEW_ACCOUNT_PACKAGE')
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.accountPkg.find(user.branchId, id);
  }

  // Cập nhật một phí dịch vụ
  @Permit('UPDATE_ACCOUNT_PACKAGE')
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountPackageDto,
  ) {
    return this.accountPkg.update(user.branchId, id, dto);
  }

  // Xóa nhiều phí dịch vụ
  @Permit('DELETE_ACCOUNT_PACKAGE')
  @Delete('batch')
  deleteMany(
    @UserCtx() user: User,
    // Sử dụng decorator @Body() để lấy danh sách id cần xóa
    @Body('ids', new ParseArrayPipe({ items: Number })) ids: number[],
  ) {
    return this.accountPkg.deleteMany(user.branchId, ids);
  }

  // Xóa một phí dịch vụ
  @Permit('DELETE_ACCOUNT_PACKAGE')
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.accountPkg.delete(user.branchId, id);
  }
}
