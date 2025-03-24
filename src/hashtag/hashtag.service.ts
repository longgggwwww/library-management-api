import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(private prisma: PrismaService) {}

  // Thêm biến includeOpts để include publication khi truy vấn
  private includeOpts = {
    include: {
      publication: true,
    },
  };

  // Thêm hàm kiểm tra quyền truy cập vào publication
  private async checkPubAccess(branchId: number, pubId: number) {
    // Tìm publication theo id
    // Include branch để kiểm tra xem publication có thuộc branch của user không
    const pub = await this.prisma.publication.findUnique({
      where: { id: pubId },
      include: {
        branch: true,
      },
    });
    // Nếu không tìm thấy publication thì throw BadRequestException
    if (!pub) {
      throw new BadRequestException('Publication not found');
    }
    // Nếu publication không thuộc branch của user thì throw BadRequestException
    if (pub.branch.id !== branchId) {
      throw new BadRequestException(
        'User does not have access to this publication',
      );
    }
    return pub;
  }

  // Hàm tạo mới một hashtag
  async create(branchId: number, dto: CreateHashtagDto) {
    // Lấy thông tin từ dto
    await this.checkPubAccess(branchId, dto.publicationId); // Kiểm tra quyền truy cập vào publication
    return this.prisma.hashtag.create({
      data: {
        ...dto,
      },
      ...this.includeOpts,
    });
  }

  // Hàm tìm nhiều hashtag theo publication
  async findByPub(branchId: number, pubId: number) {
    await this.checkPubAccess(branchId, pubId); // Kiểm tra quyền truy cập vào publication
    return this.prisma.hashtag.findMany({
      where: {
        publicationId: pubId,
      },
      ...this.includeOpts,
    });
  }

  // Hàm tìm nhiều hashtag theo branch
  async findMany(branchId: number) {
    return this.prisma.hashtag.findMany({
      where: {
        publication: {
          branchId,
        },
      },
      ...this.includeOpts,
    });
  }

  async find(branchId: number, id: number) {
    // Tìm hashtag theo id
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
      ...this.includeOpts,
    });
    if (!hashtag) {
      throw new BadRequestException('Hashtag not found');
    }
    await this.checkPubAccess(branchId, hashtag.publicationId);
    return hashtag;
  }

  async update(branchId: number, id: number, dto: UpdateHashtagDto) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });
    if (!hashtag) {
      throw new BadRequestException('Hashtag not found');
    }
    await this.checkPubAccess(branchId, dto.publicationId);
    return this.prisma.hashtag.update({
      where: {
        id,
      },
      data: dto,
      ...this.includeOpts,
    });
  }

  //  Hàm xóa hashtag
  async delete(branchId: number, id: number) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });
    if (!hashtag) {
      throw new BadRequestException('Hashtag not found');
    }
    await this.checkPubAccess(branchId, hashtag.publicationId);
    return this.prisma.hashtag.delete({
      where: {
        id,
      },
      ...this.includeOpts,
    });
  }

  // Hàm xóa nhiều hashtag cùng lúc
  async deleteBatch(branchId: number, ids: number[]) {
    const hashtags = await this.prisma.hashtag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    // Kiểm tra quyền truy cập vào publication
    for (const hashtag of hashtags) {
      await this.checkPubAccess(branchId, hashtag.publicationId);
    }
    return this.prisma.hashtag.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
