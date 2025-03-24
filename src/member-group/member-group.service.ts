import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMemberGroupDto } from './dto/create-member-group.dto';
import { UpdateMemberGroupDto } from './dto/update-member-group.dto';

@Injectable()
export class MemberGroupService {
  constructor(private prisma: PrismaService) {}

  // Định nghĩa các option để include các relation
  private includeOpts = {
    include: {
      branch: true,
      members: true,
      accountPackages: true,
    },
  };

  async create(branchId: number, dto: CreateMemberGroupDto) {
    return this.prisma.memberGroup.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Tìm nhiều member group theo branch
  async findMany(branchId: number) {
    return this.prisma.memberGroup.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.memberGroup.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Cập nhật một member group theo branch
  async update(branchId: number, id: number, dto: UpdateMemberGroupDto) {
    return this.prisma.memberGroup.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  //  Xóa một member group
  async delete(branchId: number, id: number) {
    return this.prisma.memberGroup.delete({
      where: {
        id,
        branchId,
      },
    });
  }

  // Xóa nhiều member group
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.memberGroup.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }
}
