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
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';

// Bảo vệ tất cả các route trong controller này
@UseGuards(BranchAccessGuard)
@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowing: BorrowingService) {}

  @Post()
  create(@Body() dto: CreateBorrowingDto) {
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
