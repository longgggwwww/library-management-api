import { Branch, Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { hashPwd } from '../../utils/hash-password';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho user
function getPhotoUrl(photo: string | undefined): string | null {
  if (!photo) return null;
  const photoSrc = path.join(__dirname, 'photos', 'users', `${photo}`);
  return fs.existsSync(photoSrc) ? `/users/photo/${photo}` : null;
}

// Sao chép ảnh user vào thư mục uploads/users
function copyPhoto(photo: string | undefined) {
  if (!photo) return;
  const photoSrc = path.join(__dirname, 'photos', 'users', `${photo}`);
  const destDir = path.join(__dirname, '..', '..', 'uploads', 'users');
  const destPath = path.join(destDir, `${photo}`);

  // Tạo thư mục nếu nó chưa tồn tại
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  fs.copyFileSync(photoSrc, destPath);
}

// Hàm cập nhật user
async function createAdminData(adminRole: Role, branch: Branch) {
  const hashedPwd = await hashPwd(process.env.ADMIN_PASSWORD || '123456');
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: hashedPwd,
    isAdmin: true,
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE_NUMBER,
    fullName: 'Administrator',
    roleId: adminRole.id,
    branchId: branch.id,
  };
}

// Tạo dữ liệu cho admin
export async function seedAdminUser(adminRole: Role, branch: Branch) {
  const adminData = await createAdminData(adminRole, branch);
  await prisma.user.upsert({
    where: {
      username: adminData.username,
    },
    create: adminData,
    update: adminData,
  });
  console.log("Seeded admin for 'User' table ✅");
}

// Định nghĩa kiểu dữ liệu cho user
type User = {
  branch_code: string;
  username: string;
  password: string;
  is_active: string;
  is_admin: string;
  role_code: string;
  full_name: string;
  photo?: string;
  address: string;
  birth_date: string;
  email: string;
  note?: string;
  phone: string;
};

// Hàm cập nhật user
async function upsertUser(user: User) {
  // Tìm role và branch với mã code đã cho
  // Nếu không tìm thấy, ném ra lỗi
  const [role, branch] = await Promise.all([
    prisma.role.findUnique({
      where: {
        code: user.role_code,
      },
    }),
    prisma.branch.findUnique({
      where: {
        code: user.branch_code,
      },
    }),
  ]);
  if (!role) throw new Error(`Role with code ${user.role_code} not found`);
  if (!branch)
    throw new Error(`Branch with code ${user.branch_code} not found`);

  // Mã hóa mật khẩu
  const hashedPwd = await hashPwd(user.password);
  // Lấy URL của ảnh user
  const avatarUrl = getPhotoUrl(user.photo);
  if (avatarUrl) copyPhoto(user.photo);

  // Tạo hoặc cập nhật user
  const userData = {
    branch: { connect: { id: branch.id } },
    username: user.username,
    password: hashedPwd,
    isActive: user.is_active === 'true',
    isAdmin: user.is_admin === 'true',
    role: {
      connect: {
        id: role.id,
      },
    },
    fullName: user.full_name,
    avatarUrl,
    address: user.address,
    birthDate: new Date(user.birth_date),
    email: user.email,
    note: user.note,
    phone: user.phone,
  };
  return prisma.user.upsert({
    where: {
      username: user.username,
    },
    create: userData,
    update: userData,
  });
}

// Hàm seed dữ liệu cho bảng 'User'
export async function seedUsers(file: string) {
  const users = await readCSV<User>(path.join(__dirname, 'csv', file));
  const upserts = users.map(upsertUser);
  await Promise.all(upserts);
  console.log("Seeded 'User' table ✅");
}
