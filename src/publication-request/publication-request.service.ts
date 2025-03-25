import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreatePublicationRequestDto } from './dto/create-publication-request.dto';
import { UpdatePublicationRequestDto } from './dto/update-publication-request.dto';

@Injectable()
export class PublicationRequestService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private includeOpts: Prisma.PublicationRequestInclude = {
    approvedByUser: {
      omit: {
        password: true,
      },
    },
    member: {
      omit: {
        password: true,
      },
      include: {
        branch: true,
      },
    },
  };

  async create(branchId: number, dto: CreatePublicationRequestDto) {
    return this.prisma.client.publicationRequest.create({
      data: {
        ...dto,
        approvedByUserId: null,
        memberId: null,
      },
    });
  }

  findAll() {
    return `This action returns all publicationRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publicationRequest`;
  }

  update(id: number, updatePublicationRequestDto: UpdatePublicationRequestDto) {
    return `This action updates a #${id} publicationRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicationRequest`;
  }
}
