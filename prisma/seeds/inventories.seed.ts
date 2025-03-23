import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho kho
type Inventory = {
    branch_code: string;
    code: string;
    name: string;
    description?: string;
};

// Hàm seed dữ liệu cho bảng 'Inventory'
export async function seedInventories(file: string) {
    const inventories = await readCSV<Inventory>(
        path.join(__dirname, 'csv', file),
    );

    const invPromises = inventories.map(async (inv) => {
        // Tìm branch với mã code đã cho
        const branch = await prisma.branch.findUnique({
            where: { code: inv.branch_code },
        });
        if (!branch)
            throw new Error(`Branch with code ${inv.branch_code} not found`);

        return prisma.inventory.upsert({
            where: {
                code_branchId: {
                    code: inv.code,
                    branchId: branch.id,
                },
            },
            create: {
                code: inv.code,
                branchId: branch.id,
                name: inv.name,
                description: inv.description,
            },
            update: {
                name: inv.name,
                description: inv.description,
            },
        });
    });

    await Promise.all(invPromises);

    console.log("Seeded 'Inventory' table ✅");
}
