import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreatePermDto } from './dto/create-permission.dto';
import { UpdatePermDto } from './dto/update-permission.dto';

@Injectable()
export class PermService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.PermissionInclude = {
    roles: true,
  };

  async create(dto: CreatePermDto) {
    return this.prisma.client.permission.create({
      data: dto,
      include: this.includeOpts,
    });
  }

  // Hàm tìm nhiều permission
  async findMany() {
    return this.prisma.client.permission.findMany({
      include: this.includeOpts,
    });
  }

  async find(id: string) {
    return this.prisma.client.permission.findUniqueOrThrow({
      where: { id },
      include: {
        roles: true,
      },
    });
  }

  // Hàm cập nhật thông tin một permission
  async update(id: string, dto: UpdatePermDto) {
    return this.prisma.client.permission.update({
      where: { id },
      data: dto,
      include: this.includeOpts,
    });
  }

  // Hàm xóa một permission
  async delete(id: string) {
    return this.prisma.client.permission.delete({
      where: { id },
    });
  }

  // Xóa nhiều quyền
  async deleteMany(ids: string[]) {
    return this.prisma.client.permission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
