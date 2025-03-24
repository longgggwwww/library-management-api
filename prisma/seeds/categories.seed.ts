import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho category
type Category = {
  branch_code: string;
  code: string;
  name: string;
};

async function processCategory(category: Category) {
  // Tìm branch theo branch_code
  // Nếu không tìm thấy, báo lỗi
  const branch = await prisma.branch.findUnique({
    where: { code: category.branch_code },
  });
  if (!branch)
    throw new Error(`Branch with code ${category.branch_code} not found`);

  // Tạo hoặc cập nhật category
  return prisma.category.upsert({
    where: {
      code_branchId: {
        code: category.code,
        branchId: branch.id,
      },
    },
    create: {
      branchId: branch.id,
      code: category.code,
      name: category.name,
    },
    update: {
      name: category.name,
    },
  });
}

// Hàm seed dữ liệu cho bảng 'Category'
export async function seedCategories(file: string) {
  const categories = await readCSV<Category>(path.join(__dirname, 'csv', file));
  const upserts = categories.map(processCategory);
  const result = await Promise.all(upserts);
  console.log("Seeded 'Category' table ✅");
  return result;
}
