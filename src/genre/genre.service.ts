import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
    constructor(private prisma: PrismaService) {}

    // Thêm includeOpts để include branch, parent, children, publications khi truy vấn
    private includeOpts = {
        include: {
            branch: true,
            parent: true,
            children: true,
            publications: true,
        },
    };

    async create(branchId: number, dto: CreateGenreDto) {
        return this.prisma.genre.create({
            data: {
                branchId,
                ...dto,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm tìm nhiều genre theo branch
    async findMany(branchId: number) {
        return this.prisma.genre.findMany({
            where: {
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async find(branchId: number, id: number) {
        return this.prisma.genre.findUniqueOrThrow({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm cập nhật genre
    async update(branchId: number, id: number, dto: UpdateGenreDto) {
        return this.prisma.genre.update({
            where: {
                id,
                branchId,
            },
            data: dto,
            ...this.includeOpts,
        });
    }

    // Thêm hàm xóa genre
    async delete(branchId: number, id: number) {
        return this.prisma.genre.delete({
            where: {
                id,
                branchId,
            },
        });
    }

    // Thêm hàm xóa nhiều genre cùng lúc
    async deleteBatch(branchId: number, ids: number[]) {
        return this.prisma.genre.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                branchId,
            },
        });
    }
}
