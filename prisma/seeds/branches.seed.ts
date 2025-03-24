import * as fs from 'fs';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho branch
type Branch = {
  code: string;
  name: string;
  address?: string;
  photo?: string;
  email?: string;
  phone?: string;
  website?: string;
};

// Lấy URL của ảnh branch
function getPhotoUrl(photo: string): string | null {
  const photoSrc = path.join(__dirname, 'photos', 'branches', `${photo}`);
  return fs.existsSync(photoSrc) ? `/branches/photo/${photo}` : null;
}

function copyPhoto(photo: string, photoUrl: string | null) {
  // Nếu ảnh tồn tại, sao chép ảnh vào thư mục uploads/branches
  if (photoUrl) {
    const destDir = path.join(__dirname, '..', '..', 'uploads', 'branches');
    const destPath = path.join(destDir, `${photo}`);

    // Tạo thư mục nếu nó chưa tồn tại
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Sao chép ảnh
    fs.copyFileSync(
      path.join(__dirname, 'photos', 'branches', `${photo}`),
      destPath,
    );
  }
}

async function upsertBranch(branch: Branch, logoUrl: string | null) {
  return prisma.branch.upsert({
    where: {
      code: branch.code,
    },
    create: {
      code: branch.code,
      name: branch.name,
      address: branch.address,
      email: branch.email,
      phone: branch.phone,
      website: branch.website,
      logoUrl: logoUrl,
    },
    update: {
      name: branch.name,
      address: branch.address,
      email: branch.email,
      phone: branch.phone,
      website: branch.website,
      logoUrl: logoUrl,
    },
  });
}

// Hàm xử lý dữ liệu cho bảng 'Branch'
async function processBranch(branch: Branch) {
  const logoUrl = getPhotoUrl(branch.photo);
  copyPhoto(branch.photo, logoUrl);
  return upsertBranch(branch, logoUrl);
}

export async function seedBranches(file: string) {
  const branches = await readCSV<Branch>(path.join(__dirname, 'csv', file));
  const upserts = branches.map(processBranch); // Duyệt qua từng branch và thêm vào cơ sở dữ liệu
  const result = await Promise.all(upserts);
  const rootBranch = result.find((branch) => branch.code === 'iit'); // Lấy branch gốc
  console.log("Seeded 'Branch' table ✅");
  return rootBranch;
}
