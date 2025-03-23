import * as fs from 'fs';
import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho tác giả
type Author = {
    branch_code: string;
    code: string;
    name: string;
    birth_year?: string;
    death_year?: string;
    nationality?: string;
    description?: string;
    photo?: string;
};

function getPhotoUrl(author: Author): string | null {
    // Nếu tác giả không có ảnh, trả về null
    if (!author.photo) return null;

    // Ngược lại, kiểm tra xem ảnh có tồn tại trong thư mục photos/authors không
    const photoSrc = path.join(
        __dirname,
        'photos',
        'authors',
        `${author.photo}`,
    );

    return fs.existsSync(photoSrc) ? `/authors/photo/${author.photo}` : null;
}

// Hàm sao chép ảnh tác giả vào thư mục uploads/authors
function copyPhotoIfExists(author: Author, photoUrl: string | null) {
    if (photoUrl) {
        const destDir = path.join(__dirname, '..', '..', 'uploads', 'authors');
        const destPath = path.join(destDir, `${author.photo}`);

        // Tạo thư mục nếu nó chưa tồn tại
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        // Sao chép ảnh vào thư mục uploads/authors
        fs.copyFileSync(
            path.join(__dirname, 'photos', 'authors', `${author.photo}`),
            destPath,
        );
    }
}

async function upsertAuthor(author: Author, photoUrl: string | null) {
    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: author.branch_code },
    });
    if (!branch)
        throw new Error(`Branch with code ${author.branch_code} not found`);

    // Thêm hoặc cập nhật tác giả trong cơ sở dữ liệu
    return prisma.author.upsert({
        where: {
            code_branchId: {
                code: author.code,
                branchId: branch.id,
            },
        },
        create: {
            branchId: branch.id,
            code: author.code,
            name: author.name,
            birthYear: parseInt(author.birth_year),
            deathYear: parseInt(author.death_year),
            description: author.description,
            photoUrl,
        },
        update: {
            name: author.name,
            birthYear: parseInt(author.birth_year),
            deathYear: parseInt(author.death_year),
            description: author.description,
            photoUrl,
        },
    });
}

// Hàm xử lý tác giả
async function processAuthor(author: Author) {
    const photoUrl = getPhotoUrl(author);
    copyPhotoIfExists(author, photoUrl);
    return upsertAuthor(author, photoUrl);
}

// Hàm seed dữ liệu cho bảng 'Author'
export async function seedAuthors(file: string) {
    const authors = await readCSV<Author>(path.join(__dirname, 'csv', file));
    const upserts = authors.map(processAuthor);
    await Promise.all(upserts);
    console.log("Seeded 'Author' table ✅");
}
