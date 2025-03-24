import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho năm học
type SchoolYear = {
  branch_code: string;
  code: string;
  name: string;
};

// Hàm upsert năm học
async function upsertSchoolYear(schoolYearData: SchoolYear) {
  // Tìm branch theo branch_code
  const branch = await prisma.branch.findUnique({
    where: { code: schoolYearData.branch_code },
  });
  if (!branch)
    throw new Error(`Branch with code ${schoolYearData.branch_code} not found`);

  // Thêm hoặc cập nhật năm học trong cơ sở dữ liệu
  return prisma.schoolYear.upsert({
    where: {
      code_branchId: {
        code: schoolYearData.code,
        branchId: branch.id,
      },
    },
    create: {
      branchId: branch.id,
      code: schoolYearData.code,
      name: schoolYearData.name,
    },
    update: {
      name: schoolYearData.name,
    },
  });
}

// Hàm seed dữ liệu cho bảng 'SchoolYear'
export async function seedSchoolYears(file: string) {
  const schoolYears = await readCSV<SchoolYear>(
    path.join(__dirname, 'csv', file),
  );
  const upserts = schoolYears.map(upsertSchoolYear);
  await Promise.all(upserts);
  console.log("Seeded 'SchoolYear' table ✅");
}
