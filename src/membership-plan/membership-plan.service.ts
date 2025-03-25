import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';

@Injectable()
export class MembershipPlanService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.MembershipPlanInclude = {
    membershipGroup: true,
  };

  // Tạo mới một phí dịch vụ
  async create(branchId: number, dto: CreateMembershipPlanDto) {
    // Kiểm tra xem nhóm thành viên có tồn tại hay không
    const memGroup = await this.prisma.client.membershipGroup.findUnique({
      where: {
        id: dto.membershipGroupId,
        branchId,
      },
    });
    if (!memGroup) {
      throw new BadRequestException('Member group not found');
    }

    return this.prisma.client.membershipPlan.create({
      data: dto,
      include: this.includeOpts,
    });
  }

  async findMany(branchId: number) {}

  // Tìm kiếm một phí dịch vụ
  async find(branchId: number, id: number) {
    return this.prisma.client.membershipPlan.findUnique({
      where: {
        id,
        membershipGroup: {
          branchId,
        },
      },
      include: this.includeOpts,
    });
  }

  // Cập nhật một phí dịch vụ
  async update(branchId: number, id: number, dto: UpdateMembershipPlanDto) {
    // Kiểm tra xem phí dịch vụ có tồn tại hay không
    const accountPkg = await this.prisma.client.membershipPlan.findFirst({
      where: {
        id,
      },
    });
    if (!accountPkg) {
      throw new BadRequestException('Account package not found');
    }

    // Kiêm tra nhóm thành viên có tồn tại hay không
    if (dto.membershipGroupId) {
      const memGroup = await this.prisma.client.membershipGroup.findFirst({
        where: {
          id: dto.membershipGroupId,
          branchId,
        },
      });
      if (!memGroup) {
        throw new BadRequestException('Member group not found');
      }
    }

    return this.prisma.client.membershipPlan.update({
      where: {
        id,
      },
      data: dto,
      include: this.includeOpts,
    });
  }

  // Xóa một phí dịch vụ
  async delete(branchId: number, id: number) {
    return this.prisma.client.membershipPlan.delete({
      where: {
        id,
        membershipGroup: {
          branchId,
        },
      },
    });
  }

  // Xóa nhiều phí dịch vn
  async deleteMany(branchId: number, ids: number[]) {
    return this.prisma.client.membershipPlan.deleteMany({
      where: {
        id: {
          in: ids,
        },
        membershipGroup: {
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
