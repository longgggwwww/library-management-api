import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateItemDto } from './dto/create-item.dto';
import { FindItemDto } from './dto/find-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
    constructor(private prisma: PrismaService) {}

    // Bổ sung quyền truy cập. Chỉ người dùng có quyền này mới có thể truy cập
    private includeOpts = {
        include: {
            createdByUser: {
                omit: {
                    password: true,
                },
            },
            branch: true,
            categories: true,
            tags: true,
        },
    };

    // Tạo một item mới
    async create(userId: number, branchId: number, dto: CreateItemDto) {
        return this.prisma.item.create({
            data: {
                ...dto,
                createdByUserId: userId,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async findMany(branchId: number, dto: FindItemDto) {
        const { id, take, skip, field, order, title } = dto;
        return this.prisma.item.findMany({
            where: {
                branchId,
                ...(id && { id }),
                ...(title && {
                    OR: [
                        {
                            publication: {
                                title: { contains: title },
                            },
                        },
                        {
                            publication: {
                                publicationAlias: {
                                    some: {
                                        alias: { contains: title },
                                    },
                                },
                            },
                        },
                        {
                            publication: {
                                authors: {
                                    some: { name: { contains: title } },
                                },
                            },
                        },
                        {
                            publication: {
                                genres: { some: { name: { contains: title } } },
                            },
                        },
                        {
                            publication: {
                                categories: {
                                    some: { name: { contains: title } },
                                },
                            },
                        },
                    ],
                }),
            },
            take,
            skip,
            orderBy: field && {
                [`${field}`]: order,
            },
            ...this.includeOpts,
        });
    }

    async find(branchId: number, id: number) {
        return this.prisma.item.findUniqueOrThrow({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async update(branchId: number, id: number, dto: UpdateItemDto) {
        return this.prisma.item.update({
            where: {
                id,
                branchId,
            },
            data: dto,
            ...this.includeOpts,
        });
    }

    async delete(branchId: number, id: number) {
        return this.prisma.item.delete({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async deleteBatch(branchId: number, ids: number[]) {
        return this.prisma.item.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                branchId,
            },
        });
    }
}
