import { Injectable } from '@nestjs/common';
import { CreateBorrowingFeePolicyDto } from './dto/create-borrowing-fee-policy.dto';
import { UpdateBorrowingFeePolicyDto } from './dto/update-borrowing-fee-policy.dto';

@Injectable()
export class BorrowingFeePolicyService {
  create(createBorrowingFeePolicyDto: CreateBorrowingFeePolicyDto) {
    return 'This action adds a new borrowingFeePolicy';
  }

  findAll() {
    return `This action returns all borrowingFeePolicy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowingFeePolicy`;
  }

  update(id: number, updateBorrowingFeePolicyDto: UpdateBorrowingFeePolicyDto) {
    return `This action updates a #${id} borrowingFeePolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowingFeePolicy`;
  }
}
