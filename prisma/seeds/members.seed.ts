import { $Enums } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { hashPwd } from '../../utils/hash-password';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho thành viên
type Member = {
    branch_code: string;
    VNeID: string;
    email: string;
    phone: string;
    password: string;
    full_name: string;
    birth_day: string;
    is_locked: string;
    gender: string;
    class_code: string;
    school_year_code: string;
    group_code: string;
    avatar?: string;
};

function getAvatarUrl(member: Member): string | null {
    // Nếu thành viên không có avatar, trả về null
    if (!member.avatar) return null;

    // Ngược lại, kiểm tra xem avatar có tồn tại trong thư mục photos/members không
    const avatarSrc = path.join(
        __dirname,
        'photos',
        'members',
        `${member.avatar}`,
    );

    return fs.existsSync(avatarSrc) ? `/members/avatar/${member.avatar}` : null;
}

// Hàm sao chép avatar thành viên vào thư mục uploads/members
function copyAvatarIfExists(member: Member, avatarUrl: string | null) {
    if (avatarUrl) {
        const destDir = path.join(__dirname, '..', '..', 'uploads', 'members');
        const destPath = path.join(destDir, `${member.avatar}`);

        // Tạo thư mục nếu nó chưa tồn tại
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        // Sao chép avatar vào thư mục uploads/members
        fs.copyFileSync(
            path.join(__dirname, 'photos', 'members', `${member.avatar}`),
            destPath,
        );
    }
}

async function upsertMember(member: Member, avatarUrl: string | null) {
    // Tìm branch với mã code đã cho
    const branch = await prisma.branch.findUnique({
        where: { code: member.branch_code },
    });
    if (!branch)
        throw new Error(`Branch with code ${member.branch_code} not found`);

    // Thêm hoặc cập nhật thành viên trong cơ sở dữ liệu
    return prisma.member.upsert({
        where: {
            VNeID: member.VNeID,
        },
        create: {
            branch: {
                connect: {
                    id: branch.id,
                },
            },
            VNeID: member.VNeID,
            fullName: member.full_name,
            email: member.email,
            phone: member.phone,
            password: await hashPwd(member.password),
            birthDate: new Date(member.birth_day),
            isLocked: !!member.is_locked,
            gender: member.gender as $Enums.Gender,
            class: {
                connect: {
                    code_branchId: {
                        code: member.class_code,
                        branchId: branch.id,
                    },
                },
            },
            schoolYear: {
                connect: {
                    code_branchId: {
                        code: member.school_year_code,
                        branchId: branch.id,
                    },
                },
            },
            group: {
                connect: {
                    code_branchId: {
                        code: member.group_code,
                        branchId: branch.id,
                    },
                },
            },
            avatarUrl,
        },
        update: {
            VNeID: member.VNeID,
            fullName: member.full_name,
            email: member.email,
            phone: member.phone,
            birthDate: new Date(member.birth_day),
            isLocked: !!member.is_locked,
            gender: member.gender as $Enums.Gender,
            class: {
                connect: {
                    code_branchId: {
                        code: member.class_code,
                        branchId: branch.id,
                    },
                },
            },
            schoolYear: {
                connect: {
                    code_branchId: {
                        code: member.school_year_code,
                        branchId: branch.id,
                    },
                },
            },
            group: {
                connect: {
                    code_branchId: {
                        code: member.group_code,
                        branchId: branch.id,
                    },
                },
            },
            avatarUrl,
        },
    });
}

// Hàm xử lý thành viên
async function processMember(member: Member) {
    const avatarUrl = getAvatarUrl(member);
    copyAvatarIfExists(member, avatarUrl);
    return upsertMember(member, avatarUrl);
}

// Hàm seed dữ liệu cho bảng 'Member'
export async function seedMembers(file: string) {
    const members = await readCSV<Member>(path.join(__dirname, 'csv', file));
    const upserts = members.map(processMember);
    await Promise.all(upserts);
    console.log("Seeded 'Member' table ✅");
}
