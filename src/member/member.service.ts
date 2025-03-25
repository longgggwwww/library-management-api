import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { hashPwd } from 'utils/hash-password';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  // Định nghĩa các option để include các relation
  private includeOpts: Prisma.MemberInclude = {
    borrowings: true,
    borrowedItems: true,
    class: true,
    schoolYear: true,
    membershipGroup: true,
  };

  async create(branchId: number, dto: CreateMemberDto) {
    // Hash password trước khi lưu vào cơ sở dữ liệu
    dto.password = await hashPwd(dto.password);

    return this.prisma.client.member.create({
      data: {
        branchId,
        ...dto,
      },
      include: this.includeOpts,
    });
  }

  // Tìm nhiều member theo branch
  async findMany(branchId: number) {
    return this.prisma.client.member.findMany({
      where: {
        branchId,
      },
      include: this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.client.member.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      include: this.includeOpts,
    });
  }

  // Cập nhật một member theo branch
  async update(branchId: number, id: number, dto: UpdateMemberDto) {
    // Hash password trước khi lưu vào cơ sở dữ liệu
    if (dto.password) {
      dto.password = await hashPwd(dto.password);
    }
    return this.prisma.client.member.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      include: this.includeOpts,
    });
  }

  // Xóa một member
  async delete(branchId: number, id: number) {
    return this.prisma.client.member.delete({
      where: {
        id,
        branchId,
      },
    });
  }

  // Xóa nhiều member
  async deleteMany(branchId: number, ids: number[]) {
    return this.prisma.client.member.deleteMany({
      where: {
        branchId,
        id: {
          in: ids,
        },
      },
    });
  }
}
