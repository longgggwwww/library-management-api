import { PublicationType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho publication
type Publication = {
    branch_code: string;
    code: string;
    title: string;
    author_codes: string;
    genre_codes: string;
    category_codes: string;
    language_codes: string;
    publisher_code: string;
    photo?: string;
    slug: string;
    published: string;
    type: PublicationType;
    summary: string;
    isbn: string;
    published_date: string;
    file_url?: string;
    file_size?: string;
    translator?: string;
    volume_number: string;
    cover_price: string;
    page_count: string;
};

// Đọc dữ liệu từ file CSV
async function getPublications(file: string) {
    return await readCSV<Publication>(path.join(__dirname, 'csv', file));
}

// Lấy URL của ảnh publication
function getPhotoUrl(photo: string | undefined): string | null {
    if (!photo) return null;
    const photoSrc = path.join(__dirname, 'photos', 'publications', `${photo}`);
    return fs.existsSync(photoSrc) ? `/publications/photo/${photo}` : null;
}

// Sao chép ảnh publication vào thư mục uploads/publications
function copyPhoto(photo: string | undefined) {
    if (!photo) return;
    const photoSrc = path.join(__dirname, 'photos', 'publications', `${photo}`);
    const destDir = path.join(__dirname, '..', '..', 'uploads', 'publications');
    const destPath = path.join(destDir, `${photo}`);

    // Tạo thư mục nếu nó chưa tồn tại
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    fs.copyFileSync(photoSrc, destPath);
}

// Hàm cập nhật publication
async function upsertPublication(publication: Publication) {
    // Lấy URL của ảnh publication
    const coverUrl = getPhotoUrl(publication.photo);
    if (coverUrl) copyPhoto(publication.photo);

    // Tạo mảng kết nối nhiều tác giả, thể loại, danh mục, ngôn ngữ
    const connectMany = (codes: string, branchId: number) =>
        codes.split(',').map((code) => ({ code_branchId: { code, branchId } }));

    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: publication.branch_code },
    });
    if (!branch)
        throw new Error(
            `Branch with code ${publication.branch_code} not found`,
        );

    // Tìm publisher với mã code đã cho
    const publisher = await prisma.publisher.findUnique({
        where: {
            code_branchId: {
                code: publication.publisher_code,
                branchId: branch.id,
            },
        },
    });
    if (!publisher)
        throw new Error(
            `Publisher with code ${publication.publisher_code} in branch with code ${branch.code} not found`,
        );

    // Tạo hoặc cập nhật publication
    const publicationData = {
        branchId: branch.id,
        code: publication.code,
        title: publication.title,
        authors: {
            connect: connectMany(publication.author_codes, branch.id),
        },
        genres: {
            connect: connectMany(publication.genre_codes, branch.id),
        },
        categories: {
            connect: connectMany(publication.category_codes, branch.id),
        },
        languages: {
            connect: connectMany(publication.language_codes, branch.id),
        },
        publisherId: publisher.id,
        coverUrl,
        slug: publication.slug,
        isPublished: publication.published == 'true' ? true : false,
        type: publication.type,
        summary: publication.summary,
        isbn: publication.isbn,
        publishedDate: new Date(publication.published_date),
        fileUrl: publication.file_url,
        fileSize: publication.file_size
            ? parseInt(publication.file_size)
            : undefined,
        volumeNumber: parseInt(publication.volume_number),
        coverPrice: parseInt(publication.cover_price),
        pageCount: parseInt(publication.page_count),
    };

    return prisma.publication.upsert({
        where: {
            code_branchId: {
                code: publication.code,
                branchId: branch.id,
            },
        },
        create: publicationData,
        update: publicationData,
    });
}

// Hàm seed dữ liệu cho bảng 'Publication'
export async function seedPublications(file: string) {
    /**
     * Đọc dữ liệu từ file CSV
     * Seed dữ liệu cho bảng 'Publication'
     */
    const publications = await getPublications(file);
    const upserts = publications.map(upsertPublication);
    await Promise.all(upserts);
    console.log("Seeded 'Publication' table ✅");
}
