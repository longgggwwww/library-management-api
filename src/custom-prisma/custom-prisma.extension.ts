import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

// PrismaClient với extension paginati làm việc với phân trang
export const extendedPrismaClient = new PrismaClient().$extends(pagination());

export type ExtendedPrismaClient = typeof extendedPrismaClient; // Kiểu dữ liệu của extendedPrismaClient
