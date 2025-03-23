import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindBranchDto } from './dto/find-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
    constructor(private prisma: PrismaService) {}

    private includeOpts = {
        include: {
            users: {
                omit: {
                    password: true,
                },
            },
        },
    };

    async create(dto: CreateBranchDto) {
        return this.prisma.branch.create({
            data: dto,
            ...this.includeOpts,
        });
    }

    // Thêm hàm findMany để tìm kiếm nhiều branch
    async findMany(dto: FindBranchDto) {
        return this.prisma.branch.findMany({
            ...this.includeOpts,
        });
    }

    async find(id: number) {
        return this.prisma.branch.findUnique({
            where: {
                id,
            },
            ...this.includeOpts,
        });
    }

    // Thêm hàm update để cập nhật thông tin branch
    async update(id: number, dto: UpdateBranchDto) {
        return this.prisma.branch.update({
            where: {
                id,
            },
            data: dto,
            ...this.includeOpts,
        });
    }

    async delete(id: number) {
        return this.prisma.branch.delete({
            where: {
                id,
            },
        });
    }

    // Thêm hàm deleteBatch để xóa nhiều branch
    async deleteBatch(ids: number[]) {
        return this.prisma.branch.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }

    // Thêm hàm updatePhoto để cập nhật ảnh logo
    async updateLogo(id: number, logoUrl: string) {
        return this.prisma.branch.update({
            where: {
                id,
            },
            data: {
                logoUrl,
            },
            ...this.includeOpts,
        });
    }
}
