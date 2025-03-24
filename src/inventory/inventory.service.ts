import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Thêm biến includeOpts để include branch, inventoryItems, inventoryReceipts, shelves khi truy vấn
  private includeOpts = {
    include: {
      branch: true,
      inventoryItems: true,
      inventoryReceipts: true,
      shelves: true,
    },
  };

  async create(branchId: number, dto: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: {
        branchId,
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Hàm tìm nhiều inventory theo branch
  async findMany(branchId: number) {
    return this.prisma.inventory.findMany({
      where: {
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.inventory.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm cập nhật thông tin một inventory
  async update(branchId: number, id: number, dto: UpdateInventoryDto) {
    return this.prisma.inventory.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  // Hàm xóa một inventory
  async delete(branchId: number, id: number) {
    return this.prisma.inventory.delete({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm xóa nhiều inventory cùng lúc
  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.inventory.deleteMany({
      where: {
        branchId,
        id: {
          in: ids,
        },
      },
    });
  }
}
