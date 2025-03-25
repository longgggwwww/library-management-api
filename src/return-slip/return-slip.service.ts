import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateReturnSlipDto } from './dto/create-return-slip.dto';
import { UpdateReturnSlipDto } from './dto/update-return-slip.dto';

@Injectable()
export class ReturnSlipService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createReturnSlipDto: CreateReturnSlipDto) {
    return 'This action adds a new returnSlip';
  }

  async createReturnSlip(dto: CreateReturnSlipDto) {
    // Tạo phiếu trả sách
    const returnSlip = await this.prisma.client.returnSlip.create({
      data: {
        code: dto.code,
        borrowerId: dto.borrowerId,
        returnDate: dto.returnDate,
        note: dto.note,
      },
    });

    let totalLateFee = 0;

    // Cập nhật các lần mượn sách
    for (const borrowingDto of dto.borrowings) {
      const borrowing = await this.prisma.client.borrowing.findUnique({
        where: { id: borrowingDto.borrowingId },
      });

      if (!borrowing) {
        throw new Error(
          `Borrowing record not found for ID ${borrowingDto.borrowingId}`,
        );
      }

      // Tính phí phạt trả trễ
      const lateDays = Math.max(
        0,
        (borrowingDto.returnedAt.getTime() - borrowing.dueDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      // const lateFee = lateDays * borrowing.extensionFeePerDay;
      const lateFee = lateDays * 10000;

      totalLateFee += lateFee;

      // Cập nhật trạng thái lần mượn sách
      await this.prisma.client.borrowing.update({
        where: { id: borrowingDto.borrowingId },
        data: {
          status: 'RETURNED',
          returnedAt: borrowingDto.returnedAt,
          lateFee,
          returnSlipId: returnSlip.id,
        },
      });
    }

    // Cập nhật tổng phí phạt trong phiếu trả sách
    await this.prisma.client.returnSlip.update({
      where: { id: returnSlip.id },
      data: { totalLateFee },
    });

    return returnSlip;
  }

  findAll() {
    return `This action returns all returnSlip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returnSlip`;
  }

  update(id: number, updateReturnSlipDto: UpdateReturnSlipDto) {
    return `This action updates a #${id} returnSlip`;
  }

  remove(id: number) {
    return `This action removes a #${id} returnSlip`;
  }
}
