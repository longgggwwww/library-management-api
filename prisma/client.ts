import { PrismaClient } from '@prisma/client';

// Khởi tạo Prisma Client
// Đây là một singleton, chỉ có một instance duy nhất được tạo ra
// và được sử dụng trong toàn bộ ứng dụng
// Nếu bạn muốn tạo nhiều instance, hãy tạo một hàm để tạo instance mới
// và export nó ra ngoài
const prisma = new PrismaClient();

export default prisma;
