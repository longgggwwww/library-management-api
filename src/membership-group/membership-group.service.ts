import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreateMembershipGroupDto } from './dto/create-membership-group.dto';
import { UpdateMemberGroupDto } from './dto/update-membership-group.dto';

@Injectable()
export class MembershipGroupService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.MembershipGroupInclude = {
    branch: true,
    members: true,
    membershipPlans: true,
  };

  async create(branchId: number, dto: CreateMembershipGroupDto) {
    return this.prisma.client.membershipGroup.create({
      data: {
        ...dto,
        branchId,
      },
      include: this.includeOpts,
    });
  }

  async findMany(branchId: number) {
    return this.prisma.client.membershipGroup.findMany({
      where: {
        branchId,
      },
      include: this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.client.membershipGroup.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      include: this.includeOpts,
    });
  }

  async update(branchId: number, id: number, dto: UpdateMemberGroupDto) {
    return this.prisma.client.membershipGroup.update({
      where: {
        id,
        branchId,
      },
      data: dto,
      include: this.includeOpts,
    });
  }

  async delete(branchId: number, id: number) {
    return this.prisma.client.membershipGroup.delete({
      where: {
        id,
        branchId,
      },
    });
  }

  async deleteMany(branchId: number, ids: number[]) {
    return this.prisma.client.membershipGroup.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }
}
