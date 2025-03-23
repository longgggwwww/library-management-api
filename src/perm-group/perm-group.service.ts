import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';

@Injectable()
export class PermGroupService {
    constructor(
        @Inject('CUSTOM_PRISMA')
        private prisma: CustomPrismaService<ExtendedPrismaClient>,
    ) {}

    // Định nghĩa các option để include các relation
    private includeOpts = {
        include: {
            permissions: true,
        },
    };

    // Tìm nhiều nhóm quyền
    async findMany() {
        return this.prisma.client.permissionGroup.findMany({
            ...this.includeOpts,
        });
    }

    // Tìm một nhóm quyền
    async find(id: number) {
        return this.prisma.client.permissionGroup.findUnique({
            where: {
                id,
            },
            ...this.includeOpts,
        });
    }
}
