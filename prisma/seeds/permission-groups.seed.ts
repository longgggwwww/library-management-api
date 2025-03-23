import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho nhóm quyền
type PermissionGroup = {
    code: string;
    name: string;
    permission_codes: string;
};

// Hàm xử lý nhóm quyền
async function processPermissionGroup(group: PermissionGroup) {
    // Tách các mã quyền từ chuỗi
    const permissions = group.permission_codes.split(',');

    // Thêm hoặc cập nhật nhóm quyền trong cơ sở dữ liệu
    return prisma.permissionGroup.upsert({
        where: { code: group.code },
        create: {
            code: group.code,
            name: group.name,
            permissions: {
                connect: permissions.map((code) => ({ id: code })),
            },
        },
        update: {
            name: group.name,
            permissions: {
                set: [], // Xóa các quyền cũ
                connect: permissions.map((code) => ({ id: code })), // Kết nối các quyền mới
            },
        },
    });
}

// Hàm seed dữ liệu cho bảng 'PermissionGroup'
export async function seedPermGroups(file: string) {
    const groups = await readCSV<PermissionGroup>(
        path.join(__dirname, 'csv', file),
    );
    const upserts = groups.map(processPermissionGroup);
    await Promise.all(upserts);
    console.log("Seeded 'PermissionGroup' table ✅");
}
