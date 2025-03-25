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
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlanService } from './membership-plan.service';

@UseGuards(BranchAccessGuard)
@Controller('membership-plans')
export class MembershipPlanController {
  constructor(private readonly membershipPlan: MembershipPlanService) {}

  // Tạo mới một phí dịch vụ
  @Permit('CREATE_ACCOUNT_PACKAGE')
  @Post()
  create(
    // Lấy thông tin người dùng từ decorator @UserCtx()
    @UserCtx() user: User,
    @Body() dto: CreateMembershipPlanDto,
  ) {
    return this.membershipPlan.create(user.branchId, dto);
  }

  // Tìm kiếm nhiều phí dịch vụ theo các tiêu chí
  @PublicEndpoint() // Endpoint này không cần quyền truy cập
  @Get('search')
  search(@UserCtx() user: User, @Query() query: any) {
    return this.membershipPlan.search(user.branchId, query);
  }

  // Tìm kiếm nhiều phí dịch vụ
  @Permit('VIEW_ACCOUNT_PACKAGE')
  @Get()
  findMany(@UserCtx() user: User) {
    return this.membershipPlan.findMany(user.branchId);
  }

  // Tìm kiếm một phí dịch vụ
  @Permit('VIEW_ACCOUNT_PACKAGE')
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.membershipPlan.find(user.branchId, id);
  }

  // Cập nhật một phí dịch vụ
  @Permit('UPDATE_ACCOUNT_PACKAGE')
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembershipPlanDto,
  ) {
    return this.membershipPlan.update(user.branchId, id, dto);
  }

  // Xóa nhiều phí dịch vụ
  @Permit('DELETE_ACCOUNT_PACKAGE')
  @Delete('batch')
  deleteMany(
    @UserCtx() user: User,
    // Sử dụng decorator @Body() để lấy danh sách id cần xóa
    @Body('ids', new ParseArrayPipe({ items: Number })) ids: number[],
  ) {
    return this.membershipPlan.deleteMany(user.branchId, ids);
  }

  // Xóa một phí dịch vụ
  @Permit('DELETE_ACCOUNT_PACKAGE')
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.membershipPlan.delete(user.branchId, id);
  }
}
