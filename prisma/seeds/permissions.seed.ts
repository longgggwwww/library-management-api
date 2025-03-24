import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho permission
type Permission = {
  code: string;
  name: string;
  description?: string;
};

// Hàm upsert permission
async function upsertPermission(perm: Permission) {
  return prisma.permission.upsert({
    where: { id: perm.code },
    create: {
      id: perm.code,
      name: perm.name,
      description: perm.description,
    },
    update: {
      name: perm.name,
      description: perm.description,
    },
  });
}

// Hàm seed dữ liệu cho bảng 'Permission'
export async function seedPerms(file: string) {
  const perms = await readCSV<Permission>(path.join(__dirname, 'csv', file));
  const upserts = perms.map(upsertPermission);
  const result = await Promise.all(upserts);
  console.log("Seeded 'Permission' table ✅");
  return result;
}
