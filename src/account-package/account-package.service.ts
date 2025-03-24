import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateAccountPackageDto } from './dto/create-account-package.dto';
import { UpdateAccountPackageDto } from './dto/update-account-package.dto';

@Injectable()
export class AccountPackageService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.AccountPackageInclude = {
    memGroup: true,
  };

  // Tạo mới một phí dịch vụ
  async create(branchId: number, dto: CreateAccountPackageDto) {
    // Kiểm tra xem nhóm thành viên có tồn tại hay không
    const memGroup = await this.prisma.client.memberGroup.findUnique({
      where: {
        id: dto.memGroupId,
        branchId, // Đảm bảo nhóm thành viên thuộc branchId
      },
    });
    if (!memGroup) {
      throw new BadRequestException('Member group not found');
    }

    return this.prisma.client.accountPackage.create({
      data: dto,
      include: this.includeOpts,
    });
  }

  async findMany(branchId: number) {}

  // Tìm kiếm một phí dịch vụ
  async find(branchId: number, id: number) {
    return this.prisma.client.accountPackage.findUnique({
      where: {
        id,
        memGroup: {
          branchId,
        },
      },
      include: this.includeOpts,
    });
  }

  // Cập nhật một phí dịch vụ
  async update(branchId: number, id: number, dto: UpdateAccountPackageDto) {
    // Kiểm tra xem phí dịch vụ có tồn tại hay không
    const accountPkg = await this.prisma.client.accountPackage.findFirst({
      where: {
        id,
      },
    });
    if (!accountPkg) {
      throw new BadRequestException('Account package not found');
    }

    // Kiêm tra nhóm thành viên có tồn tại hay không
    if (dto.memGroupId) {
      const memGroup = await this.prisma.client.memberGroup.findFirst({
        where: {
          id: dto.memGroupId,
          branchId,
        },
      });
      if (!memGroup) {
        throw new BadRequestException('Member group not found');
      }
    }

    return this.prisma.client.accountPackage.update({
      where: {
        id,
      },
      data: dto,
      include: this.includeOpts,
    });
  }

  // Xóa một phí dịch vụ
  async delete(branchId: number, id: number) {
    return this.prisma.client.accountPackage.delete({
      where: {
        id,
        memGroup: {
          branchId,
        },
      },
    });
  }

  // Xóa nhiều phí dịch vn
  async deleteMany(branchId: number, ids: number[]) {
    return this.prisma.client.accountPackage.deleteMany({
      where: {
        id: {
          in: ids,
        },
        memGroup: {
          branchId,
        },
      },
    });
  }

  // Tìm kiếm nhiều phí dịch vụ theo các tiêu chí
  async search(branchId: number, query: string) {
    return 'This feature is not implemented yet';
  }
}
