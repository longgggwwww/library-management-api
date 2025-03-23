import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

@Injectable()
export class SchoolYearService {
    constructor(private prisma: PrismaService) {}

    // Định nghĩa các option để include các relation
    private includeOpts = {
        include: {
            branch: true,
            members: true,
        },
    };

    async create(branchId: number, dto: CreateSchoolYearDto) {
        return this.prisma.schoolYear.create({
            data: {
                branchId,
                ...dto,
            },
            ...this.includeOpts,
        });
    }

    // Tìm nhiều school year theo branch
    async findMany(branchId: number) {
        return this.prisma.schoolYear.findMany({
            where: {
                branchId,
            },
            ...this.includeOpts,
        });
    }

    async find(branchId: number, id: number) {
        return this.prisma.schoolYear.findUniqueOrThrow({
            where: {
                id,
                branchId,
            },
            ...this.includeOpts,
        });
    }

    // Cập nhật một school year theo branch
    async update(branchId: number, id: number, dto: UpdateSchoolYearDto) {
        return this.prisma.schoolYear.update({
            where: {
                id,
                branchId,
            },
            data: dto,
            ...this.includeOpts,
        });
    }

    // Xóa một school year
    async delete(branchId: number, id: number) {
        return this.prisma.schoolYear.delete({
            where: {
                id,
                branchId,
            },
        });
    }

    // Xóa nhiều school year
    async deleteBatch(branchId: number, ids: number[]) {
        return this.prisma.schoolYear.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                branchId,
            },
        });
    }
}
