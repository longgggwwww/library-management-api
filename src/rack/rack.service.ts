import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateRackDto } from './dto/create-rack.dto';
import { UpdateRackDto } from './dto/update-rack.dto';

@Injectable()
export class RackService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.RackInclude = {
    shelf: true,
  };

  async create(branchId: number, dto: CreateRackDto) {
    // Kiểm tra kệ sách có thuộc branchId không
    const shelf = await this.prisma.client.shelf.findUnique({
      where: {
        id: dto.shelfId,
        branchId,
      },
    });
    if (!shelf) {
      throw new Error('Shelf not found');
    }

    return this.prisma.client.rack.create({
      data: dto,
      include: this.includeOpts,
    });
  }

  async findMany(branchId: number, shelfId: number) {
    return this.prisma.client.rack.findMany({
      where: {
        shelf: {
          id: shelfId,
          branchId,
        },
      },
      include: this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.client.rack.findUniqueOrThrow({
      where: {
        id,
        shelf: {
          branchId,
        },
      },
      include: this.includeOpts,
    });
  }

  async update(branchId: number, id: number, dto: UpdateRackDto) {
    return this.prisma.client.rack.update({
      where: {
        id,
        shelf: {
          branchId,
        },
      },
      data: dto,
      include: this.includeOpts,
    });
  }

  async delete(branchId: number, id: number) {
    return this.prisma.client.rack.delete({
      where: {
        id,
        shelf: {
          branchId,
        },
      },
    });
  }

  async deleteMany(branchId: number, ids: number[]) {
    return this.prisma.client.rack.deleteMany({
      where: {
        id: {
          in: ids,
        },
        shelf: {
          branchId,
        },
      },
    });
  }
}
