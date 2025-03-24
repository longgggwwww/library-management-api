import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  // Định nghĩa các option để include các relation
  private includeOpts = {
    include: {
      branch: true,
      members: true,
    },
  };

  async create(branchId: number, dto: CreateClassDto) {
    return this.prisma.class.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Tìm nhiều lớp học theo branch
  async findMany(branchId: number) {
    return this.prisma.class.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.class.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Cập nhật một lớp học theo branch
  async update(branchId: number, id: number, dto: UpdateClassDto) {
    return this.prisma.class.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  // Xóa một lớp học
  async delete(branchId: number, id: number) {
    return this.prisma.class.delete({
      where: {
        id,
        branchId,
      },
    });
  }

  // Xóa nhiều lớp học
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.class.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }
}
