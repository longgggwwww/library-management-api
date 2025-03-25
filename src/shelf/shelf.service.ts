import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelfService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(branchId: number, dto: CreateShelfDto) {
    return this.prisma.client.shelf.create({
      data: {
        ...dto,
        branchId,
      },
    });
  }

  async findMany(branchId: number) {
    return this.prisma.client.shelf.findMany({
      where: {
        branchId,
      },
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.client.shelf.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
    });
  }

  async update(branchId: number, id: number, dto: UpdateShelfDto) {
    return this.prisma.client.shelf.update({
      where: {
        id,
        branchId,
      },
      data: dto,
    });
  }

  async delete(branchId: number, id: number) {
    return this.prisma.client.shelf.deleteMany({
      where: {
        id,
        branchId,
      },
    });
  }
}
