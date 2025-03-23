import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho nhóm thành viên
type MemberGroup = {
    branch_code: string;
    code: string;
    name: string;
    max_borrowed_items: string;
    max_borrowed_days: string;
    max_borrowed_requests: string;
    description: string;
};

async function upsertMemberGroup(group: MemberGroup) {
    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: group.branch_code },
    });
    if (!branch)
        throw new Error(`Branch with code ${group.branch_code} does not exist`);

    // Thêm hoặc cập nhật nhóm thành viên trong cơ sở dữ liệu
    return prisma.memberGroup.upsert({
        where: {
            code_branchId: {
                code: group.code,
                branchId: branch.id,
            },
        },
        create: {
            branchId: branch.id,
            code: group.code,
            name: group.name,
            maxBorrowedItems: parseInt(group.max_borrowed_items),
            maxBorrowDays: parseInt(group.max_borrowed_days),
            maxBorrowRequests: parseInt(group.max_borrowed_requests),
            description: group.description,
        },
        update: {
            name: group.name,
            maxBorrowedItems: parseInt(group.max_borrowed_items),
            maxBorrowDays: parseInt(group.max_borrowed_days),
            maxBorrowRequests: parseInt(group.max_borrowed_requests),
            description: group.description,
        },
    });
}

// Hàm seed dữ liệu cho bảng 'MemberGroup'
export async function seedMemberGroups(file: string) {
    const memberGroups = await readCSV<MemberGroup>(
        path.join(__dirname, 'csv', file),
    );
    const upserts = memberGroups.map(upsertMemberGroup);
    await Promise.all(upserts);
    console.log("Seeded 'MemberGroup' table ✅");
}
