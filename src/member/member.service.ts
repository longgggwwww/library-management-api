import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { hashPwd } from 'utils/hash-password';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  // Định nghĩa các option để include các relation
  private includeOpts = {
    include: {
      branch: true,
      borrowings: true,
      borrowedItems: true,
      class: true,
      group: true,
      schoolYear: true,
    },
  };

  async create(branchId: number, dto: CreateMemberDto) {
    // Hash password trước khi lưu vào cơ sở dữ liệu
    dto.password = await hashPwd(dto.password);

    return this.prisma.member.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Tìm nhiều member theo branch
  async findMany(branchId: number) {
    return this.prisma.member.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.member.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Cập nhật một member theo branch
  async update(branchId: number, id: number, dto: UpdateMemberDto) {
    // Hash password trước khi lưu vào cơ sở dữ liệu
    if (dto.password) {
      dto.password = await hashPwd(dto.password);
    }
    return this.prisma.member.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  // Xóa một member
  async delete(branchId: number, id: number) {
    return this.prisma.member.delete({
      where: {
        id,
        branchId,
      },
    });
  }

  // Xóa nhiều member
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.member.deleteMany({
      where: {
        branchId,
        id: {
          in: ids,
        },
      },
    });
  }
}
