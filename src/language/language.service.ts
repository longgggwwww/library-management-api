import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  // Thêm biến includeOpts để include branch khi truy vấn
  private includeOpts = {
    include: {
      branch: true,
    },
  };

  async create(branchId: number, dto: CreateLanguageDto) {
    return this.prisma.language.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Hàm tìm nhiều language theo branch
  async findMany(branchId: number) {
    return this.prisma.language.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm tìm một language
  async find(branchId: number, id: number) {
    return this.prisma.language.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm cập nhật thông tin một language
  async update(branchId: number, id: number, dto: UpdateLanguageDto) {
    return this.prisma.language.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  // Hàm xóa một language
  async delete(branchId: number, id: number) {
    return this.prisma.language.delete({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm xóa nhiều language
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.language.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }
}
