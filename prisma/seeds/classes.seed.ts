import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho lớp học
type Class = {
    branch_code: string;
    code: string;
    name: string;
};

async function upsertClass(classData: Class) {
    // Tìm branch theo branch_code
    const branch = await prisma.branch.findUnique({
        where: { code: classData.branch_code },
    });
    if (!branch)
        throw new Error(
            `Branch with code ${classData.branch_code} does not exist`,
        );

    // Thêm hoặc cập nhật lớp học trong cơ sở dữ liệu
    return prisma.class.upsert({
        where: {
            code_branchId: {
                code: classData.code,
                branchId: branch.id,
            },
        },
        create: {
            branchId: branch.id,
            code: classData.code,
            name: classData.name,
        },
        update: {
            name: classData.name,
        },
    });
}

// Hàm seed dữ liệu cho bảng 'Class'
export async function seedClasses(file: string) {
    const classes = await readCSV<Class>(path.join(__dirname, 'csv', file));
    const upserts = classes.map(upsertClass);
    await Promise.all(upserts);
    console.log("Seeded 'Class' table ✅");
}
