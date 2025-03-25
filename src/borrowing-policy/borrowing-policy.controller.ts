import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { Permit } from 'src/permission/decorators/permit.decorator';
import { BorrowingPolicyService } from './borrowing-policy.service';
import { CreateBorrowingPolicyDto } from './dto/create-borrowing-policy.dto';
import { UpdateBorrowingPolicyDto } from './dto/update-borrowing-policy.dto';

@UseGuards(BranchAccessGuard)
@Controller('borrowing-policies')
export class BorrowingPolicyController {
  constructor(private readonly policy: BorrowingPolicyService) {}

  @Permit('CREATE_BORROWING_POLICY')
  @Post()
  // Tạo mới một policy mượn sáchjk
  create(@UserCtx() user: User, @Body() dto: CreateBorrowingPolicyDto) {
    return this.policy.create(user.branchId, dto);
  }

  @Permit('VIEW_ALL_BORROWING_POLICY')
  @Get('all')
  // Lấy danh sách tất cả policy mượn sách
  findMany() {
    return this.policy.findMany();
  }

  @Permit('VIEW_BORROWING_POLICY')
  @Get()
  // Lấy policy mượn sách theo branchId
  find(@UserCtx() user: User) {
    return this.policy.find(user.branchId);
  }

  @Permit('UPDATE_BORROWING_POLICY')
  @Patch()
  // Cập nhật policy mượn sách
  update(@UserCtx() user: User, @Body() dto: UpdateBorrowingPolicyDto) {
    return this.policy.update(user.branchId, dto);
  }

  @Permit('DELETE_BORROWING_POLICY')
  @Delete()
  // Xóa policy mượn sách
  delete(@UserCtx() user: User) {
    return this.policy.delete(user.branchId);
  }
}
