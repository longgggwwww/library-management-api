import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho điều kiện của mục
type ItemCondition = {
  branch_code: string; // Mã chi nhánh
  code: string; // Mã điều kiện
  name: string; // Tên điều kiện
  description: string; // Mô tả điều kiện
  color: string; // Màu sắc đại diện
  percentage: string; // Phần trăm liên quan
};

async function upsertItemCondition(condition: ItemCondition) {
  // Tìm chi nhánh với mã đã cho
  const branch = await prisma.branch.findUnique({
    where: { code: condition.branch_code },
  });
  if (!branch)
    throw new Error(`Branch with code ${condition.branch_code} not found`);

  // Thêm hoặc cập nhật điều kiện của mục trong cơ sở dữ liệu
  return prisma.itemCondition.upsert({
    where: {
      code_branchId: {
        code: condition.code,
        branchId: branch.id,
      },
    },
    create: {
      branchId: branch.id,
      code: condition.code,
      name: condition.name,
      description: condition.description,
      color: condition.color,
      percentage: parseInt(condition.percentage),
    },
    update: {
      name: condition.name,
      description: condition.description,
      color: condition.color,
      percentage: parseInt(condition.percentage),
    },
  });
}

// Hàm seed dữ liệu cho bảng 'ItemCondition'
export async function seedItemConditions(file: string) {
  const conditions = await readCSV<ItemCondition>(
    path.join(__dirname, 'csv', file), // Đọc file CSV từ thư mục 'csv'
  );
  const upserts = conditions.map(upsertItemCondition); // Thực hiện upsert cho từng điều kiện
  await Promise.all(upserts); // Chờ tất cả các upsert hoàn thành
  console.log("Seeded 'ItemCondition' table ✅");
}
