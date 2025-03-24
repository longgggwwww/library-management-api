import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Permit('CREATE_BORROW_SLIP')
  @Post('slip')
  // Tạo phiếu mượn sách
  createBorrwingSlip(
    // Lấy thông tin user từ decorator UserCtx
    @UserCtx() user: User,
    @Body() dto: CreateBorrowingSlipDto,
  ) {
    return this.borrowing.createBorrowingSlip(user.branchId, dto);
  }

  // Tạo mới một việc mượn sách
  @Post()
  create(@Body() dto: LoanTransactionDto) {
    return this.borrowing.create(dto);
  }

  @Get()
  findAll() {
    return this.borrowing.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowing.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBorrowingDto: UpdateBorrowingDto,
  ) {
    return this.borrowing.update(+id, updateBorrowingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowing.remove(+id);
  }
}
