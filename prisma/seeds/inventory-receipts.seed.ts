import { $Enums } from '@prisma/client';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho phiếu nhập kho
type InventoryReceipt = {
    branch_code: string;
    inventory_code: string;
    code: string;
    title: string;
    status: string;
    created_at: string;
    supplier: string;
};

// Hàm seed dữ liệu cho bảng 'InventoryReceipt'
export async function seedInventoryReceipts(file: string) {
    const receipts = await readCSV<InventoryReceipt>(
        path.join(__dirname, 'csv', file),
    );

    await Promise.all(
        receipts.map(async (receipt) => {
            // Tìm branch với mã code đã cho
            const branch = await prisma.branch.findUnique({
                where: { code: receipt.branch_code },
            });
            if (!branch)
                throw new Error(
                    `Branch with code ${receipt.branch_code} not found`,
                );

            // Tìm kho với mã code đã cho
            const inventory = await prisma.inventory.findUnique({
                where: {
                    code_branchId: {
                        code: receipt.inventory_code,
                        branchId: branch.id,
                    },
                },
            });
            if (!inventory)
                throw new Error(
                    `Inventory with code ${receipt.inventory_code} not found`,
                );

            await prisma.inventoryReceipt.upsert({
                where: {
                    code_branchId: {
                        code: receipt.code,
                        branchId: branch.id,
                    },
                },
                create: {
                    branchId: branch.id,
                    inventoryId: inventory.id,
                    code: receipt.code,
                    title: receipt.title,
                    status: receipt.status as $Enums.InventoryReceiptStatus,
                    supplier: receipt.supplier,
                    createdAt: new Date(receipt.created_at),
                },
                update: {
                    title: receipt.title,
                    status: receipt.status as $Enums.InventoryReceiptStatus,
                    supplier: receipt.supplier,
                    createdAt: new Date(receipt.created_at),
                },
            });
        }),
    );

    console.log("Seeded 'InventoryReceipt' table ✅");
}
