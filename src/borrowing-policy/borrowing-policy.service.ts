import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateBorrowingPolicyDto } from './dto/create-borrowing-policy.dto';
import { UpdateBorrowingPolicyDto } from './dto/update-borrowing-policy.dto';

@Injectable()
export class BorrowingPolicyService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  // Tạo mới một policy mượn sách
  async create(branchId: number, dto: CreateBorrowingPolicyDto) {
    return this.prisma.client.borrowingPolicy.create({
      data: {
        ...dto,
        branchId,
      },
    });
  }

  // Lấy danh sách tất cả policy mượn sách
  async findMany() {
    return this.prisma.client.borrowingPolicy.findMany({
      include: {
        branch: true,
      },
    });
  }

  // Tìm một policy mượn sách theo branchId
  async find(branchId: number) {
    return this.prisma.client.borrowingPolicy.findFirst({
      where: {
        branchId,
      },
    });
  }

  // Cập nhật một policy mượn sách theo branchId
  async update(branchId: number, dto: UpdateBorrowingPolicyDto) {
    return this.prisma.client.borrowingPolicy.update({
      where: {
        branchId,
      },
      data: dto,
    });
  }

  // Xóa một policy mượn sách theo id
  async delete(branchId: number) {
    return this.prisma.client.borrowingPolicy.delete({
      where: {
        id: branchId,
      },
    });
  }
}
