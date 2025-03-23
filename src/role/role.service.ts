import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) {}

    // Bổ sung quyền truy cập. Chỉ người dùng có quyền này mới có thể truy cập
    private includeOpts = {
        include: {
            users: {
                omit: {
                    password: true,
                },
            },
            permissions: true,
        },
    };

    async create(dto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                ...dto,
                permissions: {
                    connect: dto.codes.map((id) => ({ id })),
                },
            },
            ...this.includeOpts,
        });
    }

    async findMany() {
        return this.prisma.role.findMany({
            ...this.includeOpts,
        });
    }

    async find(id: number) {
        return this.prisma.role.findUniqueOrThrow({
            where: {
                id,
            },
            ...this.includeOpts,
        });
    }

    async update(id: number, dto: UpdateRoleDto) {
        return this.prisma.role.update({
            where: {
                id,
            },
            data: {
                ...dto,
                permissions:
                    dto.codes && dto.codes.length > 0
                        ? {
                              connect: dto.codes.map((id) => ({ id })),
                          }
                        : undefined,
            },
            ...this.includeOpts,
        });
    }

    async delete(id: number) {
        return this.prisma.role.delete({
            where: {
                id,
            },
            ...this.includeOpts,
        });
    }

    async deleteBatch(ids: number[]) {
        return this.prisma.role.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
