import * as fs from 'fs';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho publisher
type Publisher = {
    branch_code: string;
    code: string;
    name: string;
    photo?: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
};

// Đọc dữ liệu từ file CSV
async function getPublishers(file: string) {
    return await readCSV<Publisher>(path.join(__dirname, 'csv', file));
}

// Lấy URL của ảnh publisher
function getPhotoUrl(photo: string | undefined): string | null {
    if (!photo) return null;
    const photoSrc = path.join(__dirname, 'photos', 'publishers', `${photo}`);
    return fs.existsSync(photoSrc) ? `/publishers/photo/${photo}` : null;
}

// Sao chép ảnh publisher vào thư mục uploads/publishers
function copyPhoto(photo: string | undefined) {
    if (!photo) return;
    const photoSrc = path.join(__dirname, 'photos', 'publishers', `${photo}`);
    const destDir = path.join(__dirname, '..', '..', 'uploads', 'publishers');
    const destPath = path.join(destDir, `${photo}`);

    // Tạo thư mục nếu nó chưa tồn tại
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    fs.copyFileSync(photoSrc, destPath);
}

async function upsertPublisher(publisher: Publisher) {
    // Lấy URL của ảnh publisher
    const photoUrl = getPhotoUrl(publisher.photo);
    if (photoUrl) copyPhoto(publisher.photo);

    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: publisher.branch_code },
    });
    if (!branch)
        throw new Error(`Branch with code ${publisher.branch_code} not found`);

    return prisma.publisher.upsert({
        where: {
            code_branchId: {
                code: publisher.code,
                branchId: branch.id,
            },
        },
        create: {
            branchId: branch.id,
            code: publisher.code,
            name: publisher.name,
            address: publisher.address,
            phone: publisher.phone,
            email: publisher.email,
            note: publisher.note,
            photoUrl,
        },
        update: {
            name: publisher.name,
            address: publisher.address,
            phone: publisher.phone,
            email: publisher.email,
            note: publisher.note,
            photoUrl,
        },
    });
}

// Hàm xử lý dữ liệu cho bảng 'Publisher'
export async function seedPublishers(file: string) {
    const publishers = await getPublishers(file);
    const upserts = publishers.map(upsertPublisher);
    await Promise.all(upserts);
    console.log("Seeded 'Publisher' table ✅");
}
