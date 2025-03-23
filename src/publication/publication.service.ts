import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { FindPublicationDto } from './dto/find-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationService {
    constructor(private prisma: PrismaService) {}

    private includeOpts = {
        include: {
            createdByUser: {
                omit: {
                    password: true,
                },
            },
            branch: true,
            publisher: true,
            alternateNames: true,
            authors: true,
            categories: true,
            genres: true,
            hashtags: true,
            inventoryItems: true,
        },
    };

    async create(userId: number, branchId: number, dto: CreatePublicationDto) {
        const {
            code,
            title,
            slug,
            published,
            type,
            summary,
            isbn,
            publishedDate: pubDate,
            publisherId,
            fileUrl,
            fileSize,
            translator,
            volumeNumber,
            coverPrice,
            pageCount,
            authorIds,
            categoryIds,
            genreIds,
            alternateNameIds,
            hashtagIds,
        } = dto;
        return this.prisma.publication.create({
            data: {
                code,
                title,
                slug,
                isPublished: published,
                type,
                summary,
                isbn,
                publishedDate: pubDate,
                fileUrl,
                fileSize,
                translator,
                volumeNumber,
                coverPrice,
                pageCount,
                createdByUserId: userId,
                publisherId,
                authors: {
                    connect: authorIds?.map((id) => ({ id })) || [],
                },
                categories: {
                    connect: categoryIds?.map((id) => ({ id })) || [],
                },
                genres: {
                    connect: genreIds?.map((id) => ({ id })) || [],
                },
                publicationAlias: {
                    connect: alternateNameIds?.map((id) => ({ id })) || [],
                },
                hashtags: {
                    connect: hashtagIds?.map((id) => ({ id })) || [],
                },
            },
            ...this.includeOpts,
        });
    }

    async findMany(branchId: number, dto: FindPublicationDto) {
        const { id, take, skip, order, field, title, slug, type, hashtagIds } =
            dto;
        return this.prisma.publication.findMany({
            where: {
                branchId,
                ...(id && { id }),
                ...(title && {
                    OR: [
                        { title: { contains: title } },
                        {
                            publicationAlias: {
                                some: {
                                    alias: { contains: title },
                                },
                            },
                        },
                    ],
                }),
                ...(slug && { slug: { contains: slug } }),
                ...(type && { type }),
                ...(hashtagIds && {
                    hashtags: { some: { id: { in: hashtagIds } } },
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
        return this.prisma.publication.findUniqueOrThrow({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async update(branchId: number, id: number, dto: UpdatePublicationDto) {
        const {
            code,
            title,
            slug,
            published,
            type,
            summary,
            isbn,
            publishedDate: pubDate,
            publisherId,
            fileUrl,
            fileSize,
            translator,
            volumeNumber,
            coverPrice,
            pageCount,
            authorIds,
            categoryIds,
            genreIds,
            alternateNameIds,
            hashtagIds,
        } = dto;
        return this.prisma.publication.update({
            where: {
                id,
                branchId,
            },
            data: {
                code,
                title,
                slug,
                isPublished: published,
                type,
                summary,
                isbn,
                publishedDate: pubDate,
                publisherId,
                fileUrl,
                fileSize,
                translator,
                volumeNumber,
                coverPrice,
                pageCount,
                authors: {
                    set: authorIds?.map((id) => ({ id })) || [],
                },
                categories: {
                    set: categoryIds?.map((id) => ({ id })) || [],
                },
                genres: {
                    set: genreIds?.map((id) => ({ id })) || [],
                },
                publicationAlias: {
                    set: alternateNameIds?.map((id) => ({ id })) || [],
                },
                hashtags: {
                    set: hashtagIds?.map((id) => ({ id })) || [],
                },
            },
            ...this.includeOpts,
        });
    }

    async delete(branchId: number, id: number) {
        return this.prisma.publication.delete({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async deleteBatch(branchId: number, ids: number[]) {
        return this.prisma.publication.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                branchId,
            },
        });
    }

    async updateCover(branchId: number, id: number, coverUrl: string) {
        return this.prisma.publication.update({
            where: {
                id,
                branchId,
            },
            data: {
                coverUrl,
            },
            ...this.includeOpts,
        });
    }
}
