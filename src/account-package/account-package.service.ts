import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateAccountPackageDto } from './dto/create-account-package.dto';
import { UpdateAccountPackageDto } from './dto/update-account-package.dto';

@Injectable()
export class AccountPackageService {
    constructor(
        private readonly prismaService: PrismaService,
        // @Inject('CUSTOM_PRISMA_CLIENT')
        // private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) {}

    // Include các thông tin liên quan
    private includeOpts: Prisma.AccountPackageInclude = {
        memberGroup: true,
    };

    // Hàm tạo mới một phí dịch vụ
    async create(branchId: number, dto: CreateAccountPackageDto) {
        // Kiểm tra xem memberGroupId có thuộc branchId hay không
        const memberGroup = await this.prismaService.memberGroup.findUnique({
            where: {
                id: dto.memberGroupId,
                branchId, // Đảm bảo memberGroup thuộc branchId
            },
        });

        if (!memberGroup) {
            throw new Error(
                'Member group does not belong to the specified branch',
            );
        }
        return this.prismaService.accountPackage.create({
            data: dto,
            include: this.includeOpts,
        });
    }

    async findMany(branchId: number) {}

    // Hàm kiểm tra xem một phí dịch vụ có tồn tại hay không
    async find(branchId: number, id: number) {
        return this.prismaService.accountPackage.findUniqueOrThrow({
            where: {
                id,
                memberGroup: {
                    branchId, // Kiểm tra xem phí dịch vụ có thuộc branch của người dùng hay không
                },
            },
            include: this.includeOpts,
        });
    }

    // Hàm cập nhật một phí dịch vụ
    async update(branchId: number, id: number, dto: UpdateAccountPackageDto) {
        // Kiểm tra xem phí dịch vụ có tồn tại hay không
        const accountPackage =
            await this.prismaService.accountPackage.findUnique({
                where: {
                    id,
                    memberGroup: {
                        branchId, // Đảm bảo phí dịch vụ thuộc branchId
                    },
                },
            });
        if (!accountPackage) {
            throw new Error('Account package not found');
        }

        // Kiểm tra xem member group có tồn tại hay không
        if (dto.memberGroupId) {
            const memberGroup = await this.prismaService.memberGroup.findFirst({
                where: {
                    id: dto.memberGroupId,
                    branchId,
                },
            });
            if (!memberGroup) {
                throw new Error('Member group not found');
            }
        }

        return this.prismaService.accountPackage.update({
            where: {
                id,
            },
            data: {
                ...dto,
                memberGroupId: dto.memberGroupId,
            },
            // ...this.includeOpts,
        });
    }

    // Hàm xóa một phí dịch vụ
    async delete(branchId: number, id: number) {
        return this.prismaService.accountPackage.delete({
            where: {
                id,
                memberGroup: {
                    branchId,
                },
            },
        });
    }

    // Hàm xóa nhiều phí dịch vụ
    async deleteMany(branchId: number, ids: number[]) {
        return this.prismaService.accountPackage.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                memberGroup: {
                    branchId,
                },
            },
        });
    }

    // Hàm tìm kiếm phí dịch vụ theo tên
    async search(branchId: number, query: string) {
        return 'This feature is not implemented yet';
    }
}
