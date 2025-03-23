import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
    constructor(private prisma: PrismaService) {}

    // Thêm includeOpts để include branch khi truy vấn
    private includeOpts = {
        include: {
            branch: true,
        },
    };

    async create(branchId: number, dto: CreateAuthorDto) {
        return this.prisma.author.create({
            data: {
                ...dto,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm findMany để tìm tác giả theo branchId
    async findMany(branchId: number) {
        return this.prisma.author.findMany({
            where: {
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm find để tìm tác giả theo branchId và id
    async find(branchId: number, id: number) {
        return this.prisma.author.findUniqueOrThrow({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm update để cập nhật thông tin tác giả
    async update(branchId: number, id: number, dto: UpdateAuthorDto) {
        return this.prisma.author.update({
            where: {
                id,
                branchId,
            },
            data: dto,
            ...this.includeOpts,
        });
    }

    async delete(branchId: number, id: number) {
        return this.prisma.author.delete({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm deleteBatch để xóa nhiều tác giả cùng lúc
    async deleteBatch(branchId: number, ids: number[]) {
        return this.prisma.author.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                branchId,
            },
        });
    }

    // Thêm hàm updatePhoto để cập nhật ảnh đại diện cho tác giả
    async updatePhoto(branchId: number, id: number, photoUrl: string) {
        return this.prisma.author.update({
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
