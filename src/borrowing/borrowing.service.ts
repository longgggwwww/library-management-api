import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import {
  CreateBorrowingSlipDto,
  LoanTransactionDto,
} from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';

@Injectable()
export class BorrowingService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly borrowing: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createBorrowingDto: LoanTransactionDto) {
    return 'This action adds a new borrowing';
  }

  async createBorrowingSlip(
    branchId: number, // branchId của người tạo phiếu (vd: thủ thư)
    dto: CreateBorrowingSlipDto,
  ) {
    const { code, borrowerId, borrowingDate, dueDate, note, borrowings } = dto; // Desctructuring

    // Kiểm tra người mượn có thuộc branchId của người tạo phiếu hay không
    const borrower = await this.borrowing.client.member.findUnique({
      where: {
        id: borrowerId,
        branchId, // Đảm bảo người mượn thuộc branchId
      },
    });
    if (!borrower) {
      throw new BadRequestException('Borrower not found');
    }

    // Yêu cầu ngày trả phải sau ngày mượn
    if (dueDate <= borrowingDate) {
      throw new BadRequestException('Due date must be after borrowing date');
    }

    // Tạo phiếu mượn sách
    const slip = await this.borrowing.client.borrowingSlip.create({
      data: {
        code,
        borrowerId,
        borrowingDate,
        dueDate,
        note,
        totalFee: 0,
        borrowings: {
          createMany:
            borrowings && borrowings.length > 0
              ? {
                  data: borrowings.map((record) => ({
                    code: '',
                    itemId: record.itemId,
                    dueDate: dueDate,
                    borrowedAt: borrowingDate,
                    borrowingFee: 0,
                    borrowerId: borrowerId,
                  })),
                }
              : undefined,
        },
      },
    });
    return slip;
  }

  findAll() {
    return `This action returns all borrowing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowing`;
  }

  update(id: number, updateBorrowingDto: UpdateBorrowingDto) {
    return `This action updates a #${id} borrowing`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowing`;
  }
}
