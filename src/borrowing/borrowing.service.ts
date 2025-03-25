import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOptsBorrowingSlip: Prisma.BorrowingSlipInclude = {
    branch: true,
    borrower: {
      omit: {
        password: true,
      },
    },
    borrowings: true,
  };

  private inclueOptsBorrowing: Prisma.BorrowingInclude = {
    item: true,
    borrower: {
      omit: {
        password: true,
      },
    },
  };

  create(createBorrowingDto: LoanTransactionDto) {
    return 'This action adds a new borrowing';
  }

  async createBorrowingSlip(
    branchId: number, // branchId của người tạo phiếu (vd: thủ thư)
    dto: CreateBorrowingSlipDto,
  ) {
    // Kiểm tra người mượn có thuộc branchId của người tạo phiếu quản lý không
    const borrower = await this.prisma.client.member.findUnique({
      where: {
        id: dto.borrowerId,
        branchId, // Đảm bảo người mượn thuộc branchId
      },
      include: {
        membershipGroup: true,
      },
    });
    if (!borrower) {
      throw new BadRequestException('Borrower not found');
    }
    const record = await this.prisma.client.borrowingSlip.create({
      data: {
        ...dto,
        branchId,
        totalFee: 0,
        borrowings: {
          createMany: {
            data: dto.borrowings.map((r) => ({
              code:
                r.code ||
                `${Date.now()}-${branchId}-${borrower.id}-${r.itemId}`,
              itemId: r.itemId,
              dueDate: dto.dueDate,
              borrowedAt: dto.borrowingDate,
              borrowingFee: r.borrowingFee || 0,
              borrowerId: dto.borrowerId,
            })),
          },
        },
      },
      include: this.includeOptsBorrowingSlip,
    });

    // Cập nhật thông tin sách đã được mượn
    for (const record of dto.borrowings) {
      await this.prisma.client.item.update({
        where: {
          id: record.itemId,
        },
        data: {
          borrowerId: dto.borrowerId,
          status: 'BORROWED',
        },
      });
    }

    return record;
  }

  async findMany(branchId: number) {
    return this.prisma.client.borrowingSlip.findMany({
      where: {
        branchId,
      },
      include: this.includeOptsBorrowingSlip,
    });
  }

  async find(branchdId: number, id: number) {
    return this.prisma.client.borrowingSlip.findUnique({
      where: {
        id,
        branchId: branchdId,
      },
      include: this.includeOptsBorrowingSlip,
    });
  }

  async update(branchId: number, id: number, dto: UpdateBorrowingDto) {
    return this.prisma.client.borrowingSlip.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      include: this.includeOptsBorrowingSlip,
    });
  }

  async delete(branchId: number, id: number) {
    const record = await this.prisma.client.borrowingSlip.delete({
      where: {
        id,
        branchId,
      },
      include: this.includeOptsBorrowingSlip,
    });

    // Cập nhật thông tin sách đã mượn
    await this.prisma.client.item.updateMany({
      where: {
        id: {
          in: record.borrowings.map((r) => r.itemId),
        },
      },
      data: {
        borrowerId: null,
        status: 'AVAILABLE',
      },
    });

    return record;
  }

  async deleteMany(branchId: number, ids: number[]) {
    // Lấy thông tin phiếu mượn sách
    const borrowings = await this.prisma.client.borrowing.findMany({
      where: {
        borrowingSlipId: {
          in: ids,
        },
      },
      include: this.inclueOptsBorrowing,
    });

    // Xóa phiếu mượn sách
    await this.prisma.client.borrowingSlip.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });

    // Cập nhật thông tin sách đã mượn
    await this.prisma.client.item.updateMany({
      where: {
        id: {
          in: borrowings.map((r) => r.itemId),
        },
      },
      data: {
        borrowerId: null,
        status: 'AVAILABLE',
      },
    });
  }
}
