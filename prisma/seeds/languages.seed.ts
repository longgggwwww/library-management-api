import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho ngôn ngữ
type Language = {
  branch_code: string;
  code: string;
  name: string;
};

// Hàm upsert ngôn ngữ
async function upsertLanguage(lang: Language) {
  // Tìm branch với mã code đã cho
  const branch = await prisma.branch.findUnique({
    where: { code: lang.branch_code },
  });
  if (!branch)
    throw new Error(`Branch with code ${lang.branch_code} not found`);

  // Tạo hoặc cập nhật ngôn ngữ
  return prisma.language.upsert({
    where: {
      code_branchId: {
        code: lang.code,
        branchId: branch.id,
      },
    },
    create: {
      branchId: branch.id,
      code: lang.code,
      name: lang.name,
    },
    update: {
      name: lang.name,
    },
  });
}

// Hàm seed dữ liệu cho bảng 'Language'
export async function seedLanguages(file: string) {
  const langs = await readCSV<Language>(path.join(__dirname, 'csv', file));
  const upserts = langs.map(upsertLanguage);
  await Promise.all(upserts);
  console.log("Seeded 'Language' table ✅");
}
