import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { FindPublisherDto } from './dto/find-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(private prisma: PrismaService) {}

  private includeOpts = {
    include: {
      createdByUser: {
        omit: {
          password: true,
        },
      },
      branch: true,
    },
  };

  async create(userId: number, branchId: number, dto: CreatePublisherDto) {
    const { code, name, email, phone, address, note } = dto;
    return this.prisma.publisher.create({
      data: {
        code,
        name,
        email,
        phone,
        address,
        note,
        branchId,
        createdByUserId: userId,
      },
      ...this.includeOpts,
    });
  }

  async findMany(branchId: number, dto: FindPublisherDto) {
    const { id, take, skip, order, field } = dto;
    return this.prisma.publisher.findMany({
      where: {
        branchId,
      },
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    return this.prisma.publisher.findUniqueOrThrow({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async update(branchId: number, id: number, dto: UpdatePublisherDto) {
    const { code, name, email, phone, address, note } = dto;
    return this.prisma.publisher.update({
      where: {
        id,
        branchId,
      },
      data: {
        code,
        name,
        email,
        phone,
        address,
        note,
      },
      ...this.includeOpts,
    });
  }

  async delete(branchId: number, id: number) {
    return this.prisma.publisher.delete({
      where: {
        id,
        branchId,
      },
      ...this.includeOpts,
    });
  }

  async deleteBatch(branchId: number, ids: number[]) {
    return this.prisma.publisher.deleteMany({
      where: {
        id: {
          in: ids,
        },
        branchId,
      },
    });
  }

  async updatePhoto(branchId: number, id: number, photoUrl: string) {
    return this.prisma.publisher.update({
      where: {
        id,
        branchId,
      },
      data: {
        photoUrl,
      },
      ...this.includeOpts,
    });
  }
}
