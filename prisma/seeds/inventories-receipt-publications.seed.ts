import { $Enums } from '@prisma/client';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho ReceiptPublication
type ReceiptPublication = {
    branch_code: string;
    publication_code: string;
    inventory_receipt_code: string;
    quantity: string;
    condition_code: string;
};

// Hàm tìm bản ghi chung theo điều kiện
async function findRecord(model: any, where: object, errorMessage: string) {
    const record = await model.findUnique({ where });
    if (!record) throw new Error(errorMessage);
    return record;
}

// Hàm tìm chi nhánh theo mã code
async function findBranch(branchCode: string) {
    return findRecord(
        prisma.branch,
        { code: branchCode },
        `Branch with code ${branchCode} not found`,
    );
}

// Hàm tìm kho theo branchId và mã code
async function findInventory(branchId: number, inventoryCode: string) {
    return findRecord(
        prisma.inventory,
        { code_branchId: { code: inventoryCode, branchId } },
        `Inventory with code ${inventoryCode} not found`,
    );
}

// Hàm tìm phiếu nhập kho theo branchId và mã code
async function findInventoryReceipt(branchId: number, receiptCode: string) {
    return findRecord(
        prisma.inventoryReceipt,
        { code_branchId: { code: receiptCode, branchId } },
        `InventoryReceipt with code ${receiptCode} not found`,
    );
}

// Hàm tìm ấn phẩm theo branchId và mã code
async function findPublication(branchId: number, publicationCode: string) {
    return findRecord(
        prisma.publication,
        { code_branchId: { code: publicationCode, branchId } },
        `Publication with code ${publicationCode} not found`,
    );
}

// Hàm tìm điều kiện của mục theo branchId và mã code
async function findItemCondition(branchId: number, conditionCode: string) {
    return findRecord(
        prisma.itemCondition,
        { code_branchId: { code: conditionCode, branchId } },
        `ItemCondition with code ${conditionCode} not found`,
    );
}

// Hàm tạo các mục (items) dựa trên quantity
async function createItems({
    branchId,
    inventoryId,
    publicationId,
    receiptId,
    publicationCode,
    quantity,
    conditionId,
}: {
    branchId: number;
    inventoryId: number;
    publicationId: number;
    receiptId: number;
    publicationCode: string;
    quantity: number;
    conditionId: number;
}) {
    const items = Array.from({ length: quantity }, (_, idx) => ({
        barcode: `${publicationCode}.${idx + 1}`,
        branchId,
        inventoryId,
        inventoryReceiptPublicationPublicationId: publicationId,
        inventoryReceiptPublicationInventoryReceiptId: receiptId,
        conditionId,
        status: 'AVAILABLE' as $Enums.InventoryItemStatus, // Trạng thái mặc định
    }));

    await prisma.item.createMany({ data: items });
}

// Hàm kiểm tra xem publicationId và receiptId đã tồn tại trong inventoryReceiptPublication hay chưa
async function checkIfItemsExist(publicationId: number, receiptId: number) {
    const count = await prisma.item.count({
        where: {
            inventoryReceiptPublicationPublicationId: publicationId,
            inventoryReceiptPublicationInventoryReceiptId: receiptId,
        },
    });
    return count > 0;
}

// Hàm seed dữ liệu cho bảng 'InventoriesReceiptPublications'
export async function seedInventoriesReceiptPublications(file: string) {
    const rows = await readCSV<ReceiptPublication>(
        path.join(__dirname, 'csv', file),
    );

    for (const r of rows) {
        const branch = await findBranch(r.branch_code);
        const invReceipt = await findInventoryReceipt(
            branch.id,
            r.inventory_receipt_code,
        );
        const publication = await findPublication(
            branch.id,
            r.publication_code,
        );

        const quantity = parseInt(r.quantity);

        const record = await prisma.inventoryReceiptPublication.upsert({
            where: {
                publicationId_inventoryReceiptId: {
                    publicationId: publication.id,
                    inventoryReceiptId: invReceipt.id,
                },
            },
            create: {
                inventoryReceiptId: invReceipt.id,
                publicationId: publication.id,
                quantity,
            },
            update: {
                quantity,
            },
        });

        // Kiểm tra xem các mục (items) đã tồn tại hay chưa
        const itemsExist = await checkIfItemsExist(
            record.publicationId,
            record.inventoryReceiptId,
        );

        if (!itemsExist) {
            // Tìm điều kiện của mục
            const itemCondition = r.condition_code
                ? await findItemCondition(branch.id, r.condition_code)
                : undefined;
            if (!itemCondition)
                throw new Error(
                    `ItemCondition with code ${r.condition_code} not found`,
                );

            // Tạo các mục (items) dựa trên quantity
            await createItems({
                branchId: branch.id,
                inventoryId: invReceipt.inventoryId,
                publicationId: record.publicationId,
                receiptId: record.inventoryReceiptId,
                publicationCode: publication.code,
                quantity,
                conditionId: itemCondition.id,
            });
        }
    }

    console.log(
        "Seeded 'InventoriesReceiptPublications' table and 'Items' table ✅",
    );
}
