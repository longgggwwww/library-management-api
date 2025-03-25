import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowingFeePolicyService } from './borrowing-fee-policy.service';
import { CreateBorrowingFeePolicyDto } from './dto/create-borrowing-fee-policy.dto';
import { UpdateBorrowingFeePolicyDto } from './dto/update-borrowing-fee-policy.dto';

@Controller('borrowing-fee-policy')
export class BorrowingFeePolicyController {
  constructor(private readonly borrowingFeePolicyService: BorrowingFeePolicyService) {}

  @Post()
  create(@Body() createBorrowingFeePolicyDto: CreateBorrowingFeePolicyDto) {
    return this.borrowingFeePolicyService.create(createBorrowingFeePolicyDto);
  }

  @Get()
  findAll() {
    return this.borrowingFeePolicyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowingFeePolicyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowingFeePolicyDto: UpdateBorrowingFeePolicyDto) {
    return this.borrowingFeePolicyService.update(+id, updateBorrowingFeePolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowingFeePolicyService.remove(+id);
  }
}
