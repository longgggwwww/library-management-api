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
import { Permit } from 'src/permission/decorators/permit.decorator';
import { BorrowingService } from './borrowing.service';
import {
  CreateBorrowingSlipDto,
  LoanTransactionDto,
} from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';

@UseGuards(BranchAccessGuard) // Kiểm tra quyền truy cập vào branch
@Controller('borrowings') // Các route liên quan đến việc mượn sách
export class BorrowingController {
  constructor(private readonly borrowing: BorrowingService) {}

  // ------------------ Borrowing Slip (Phiếu mượn sách) ------------------

  @Permit('CREATE_BORROW_SLIP')
  @Post('borrowing-slip')
  // Tạo phiếu mượn sách
  createBorrwingSlip(
    // Lấy thông tin user từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateBorrowingSlipDto,
  ) {
    return this.borrowing.createBorrowingSlip(user.branchId, dto);
  }

  // ------------------ Loan Transaction, Borrowing (Việc mượn sách) ------------------

  // Tạo mới một việc mượn sách
  @Post()
  create(@Body() dto: LoanTransactionDto) {
    return this.borrowing.create(dto);
  }

  @Permit('VIEW_BORROW_SLIP')
  @Get('borrowing-slip')
  // Lấy danh sách phiếu mượn sách
  findMany(@UserCtx() user: User) {
    return this.borrowing.findMany(user.branchId);
  }

  @Permit('VIEW_BORROW_SLIP')
  @Get('borrowing-slip/:id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.borrowing.find(user.branchId, id);
  }

  @Permit('UPDATE_BORROW_SLIP')
  @Patch('borrowing-slip/:id')
  // Cập nhật thông tin một phiếu mượn sách
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBorrowingDto,
  ) {
    return this.borrowing.update(user.branchId, id, dto);
  }

  @Permit('DELETE_BORROW_SLIP')
  @Delete('borrowing-slip/:id')
  // Xóa một phiếu mượn sách
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.borrowing.delete(user.branchId, id);
  }
}
