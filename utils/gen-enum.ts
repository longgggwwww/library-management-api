import * as fs from 'fs';
import * as path from 'path';
import { readCSV } from './read-csv-file';

// Định nghĩa kiểu dữ liệu cho quyền
type Perm = {
  code: string;
  name: string;
  desc?: string;
};

// Hàm tạo enum từ file CSV
async function genEnum(csvFile: string, enumName: string, outFile: string) {
  const perms = await readCSV<Perm>(csvFile);
  const entries = perms.map(({ code }) => `${code} = "${code}"`).join(',\n  ');
  const content = `export enum ${enumName} {\n  ${entries}\n}\n`;
  fs.writeFileSync(outFile, content);
  console.log(`Enum ${enumName} has been generated at ${outFile}`);
}

// Đường dẫn đến file CSV và file enum
const csvPath = path.join(
  __dirname,
  '..',
  'prisma',
  'seeds',
  'csv',
  'permissions.csv',
);
const outPath = path.join(
  __dirname,
  '..',
  'src',
  'permission',
  'permissions.enum.ts',
);

genEnum(csvPath, 'Permissions', outPath);
