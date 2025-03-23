import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho genre
type Genre = {
    branch_code: string;
    code: string;
    name: string;
    description?: string;
    parent_code?: string;
};

async function processGenreWithoutParent(genre: Genre) {
    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: {
            code: genre.branch_code,
        },
    });
    if (!branch)
        throw new Error(`Branch with code ${genre.branch_code} not found`);

    // Tạo hoặc cập nhật genre
    return prisma.genre.upsert({
        where: {
            code_branchId: {
                code: genre.code,
                branchId: branch.id,
            },
        },
        create: {
            branchId: branch.id,
            code: genre.code,
            name: genre.name,
            description: genre.description,
        },
        update: {
            name: genre.name,
            description: genre.description,
        },
    });
}

// Hàm cập nhật genre với parent
async function updateGenreWithParent(genre: Genre) {
    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: genre.branch_code },
    });
    if (!branch)
        throw new Error(`Branch with code ${genre.branch_code} not found`);

    if (genre.parent_code) {
        // Tìm parent genre với parent_code
        const parent = await prisma.genre.findUnique({
            where: {
                code_branchId: {
                    code: genre.parent_code,
                    branchId: branch.id,
                },
            },
        });
        if (!parent)
            throw new Error(
                `Genre with code ${genre.parent_code} in branch with code ${branch.code} not found`,
            );

        // Cập nhật genre với parent
        return prisma.genre.update({
            where: {
                code_branchId: {
                    code: genre.code,
                    branchId: branch.id,
                },
            },
            data: {
                parentId: parent.id,
            },
        });
    }
}

// Hàm seed dữ liệu cho bảng 'Genre'
export async function seedGenres(file: string) {
    const genres = await readCSV<Genre>(path.join(__dirname, 'csv', file));
    const upsertsWithoutParent = genres.map(processGenreWithoutParent); // Tạo hoặc cập nhật genre không có parent
    await Promise.all(upsertsWithoutParent);
    const updatesWithParent = genres.map(updateGenreWithParent); // Cập nhật genre có parent
    await Promise.all(updatesWithParent);

    console.log("Seeded 'Genre' table ✅");
}
