import { Permission } from '@prisma/client';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho role
type Role = {
  code: string;
  name: string;
  permission_codes: string;
  description?: string;
  color?: string;
};

// Hàm upsert role
async function upsertRole(role: Role) {
  // Lấy danh sách id của permission từ permission_codes
  const permIds = Array.from(new Set(role.permission_codes.split(','))).map(
    (code: string) => ({ id: code }),
  );

  // Tạo hoặc cập nhật role
  return prisma.role.upsert({
    where: { code: role.code },
    create: {
      name: role.name,
      code: role.code,
      permissions: { connect: permIds },
      description: role.description,
      color: role.color,
    },
    update: {
      name: role.name,
      permissions: {
        connect: permIds,
      },
      description: role.description,
      color: role.color,
    },
  });
}

export async function seedRoles(file: string, perms: Permission[]) {
  // Tạo role 'admin' với tất cả các permission
  const permIds = perms.map((perm) => ({
    id: perm.id,
  }));

  // Tạo hoặc cập nhật role 'admin'
  const admin = await prisma.role.upsert({
    where: { code: 'admin' },
    create: {
      name: 'Quản trị viên',
      code: 'admin',
      permissions: { connect: permIds },
      description: 'Truy cập đầy đủ vào tất cả các tài nguyên',
      color: '#FF0000',
    },
    update: {
      permissions: { connect: permIds },
      color: '#FF0000',
    },
  });

  // Đọc dữ liệu từ file CSV và tạo hoặc cập nhật role
  // với các permission tương ứng
  // Lưu ý: role 'admin' đã được tạo ở trên
  // nên không cần tạo lại
  const roles = await readCSV<Role>(path.join(__dirname, 'csv', file));
  const upserts = roles.map(upsertRole);
  await Promise.all(upserts);
  console.log("Seeded 'Role' table ✅");
  return admin;
}
