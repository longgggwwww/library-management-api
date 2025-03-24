import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Thêm biến includeOpts để include các trường liên quan
  private includeOpts = {
    include: {
      branch: true,
      publications: {
        include: {
          authors: true,
          createdByUser: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  };

  async create(branchId: number, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Thêm hàm tìm nhiều category theo branch
  async findMany(branchId: number) {
    return this.prisma.category.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Thêm hàm cập nhật category
  async update(branchId: number, id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  // Thêm hàm xóa category
  async delete(branchId: number, id: number) {
    return this.prisma.category.delete({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Thêm hàm xóa nhiều category cùng lúc
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }
}
