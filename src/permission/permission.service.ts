import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { CreatePermDto } from './dto/create-permission.dto';
import { UpdatePermDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @Inject(CUSTOM_PRISMA_CLIENT)
        private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
    ) {}

    private includeOpts: Prisma.PermissionInclude = {
        roles: true,
    };

    async create(dto: CreatePermDto) {
        return this.prisma.client.permission.create({
            data: dto,
            ...this.includeOpts,
        });
    }

    // Hàm tìm nhiều permission
    async findMany() {
        return this.prisma.client.permission.findMany({
            include: this.includeOpts,
        });
        // .withPages({
        //     limit: 10,
        //     page: 1,
        // });
    }

    async find(id: string) {
        return this.prisma.client.permission.findUniqueOrThrow({
            where: { id },
            ...this.includeOpts,
        });
    }

    // Hàm cập nhật thông tin một permission
    async update(id: string, dto: UpdatePermDto) {
        return this.prisma.client.permission.update({
            where: { id },
            data: dto,
            ...this.includeOpts,
        });
    }

    // Hàm xóa một permission
    async delete(id: string) {
        return this.prisma.client.permission.delete({
            where: { id },
            ...this.includeOpts,
        });
    }

    // Xóa nhiều quyền
    async deleteMany(ids: string[]) {
        return this.prisma.client.permission.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
