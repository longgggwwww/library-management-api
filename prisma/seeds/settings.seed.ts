import * as path from 'path';
import { readCSV } from '../../utils/read-csv-file';
import prisma from '../client';

// Định nghĩa kiểu dữ liệu cho setting
type Setting = { default_user_role_code: string };

// Hàm tìm role theo code
async function findRoleByCode(code: string) {
    return prisma.role.findUnique({
        where: { code },
    });
}

// Hàm upsert setting với roleId
async function upsertSettingWithRole(roleCode: string) {
    await prisma.setting.upsert({
        where: { id: 1 },
        create: {
            defaultUserRole: {
                connect: { code: roleCode },
            },
        },
        update: {
            defaultUserRole: {
                connect: { code: roleCode },
            },
        },
    });
}

// Hàm upsert setting
async function upsertSetting(setting: Setting) {
    const role = await findRoleByCode(setting.default_user_role_code);
    if (role) await upsertSettingWithRole(role.code);
}

// Hàm seed dữ liệu cho bảng 'Setting'
export async function seedSettings(file: string) {
    const settings = await readCSV<Setting>(path.join(__dirname, 'csv', file));
    await Promise.all(settings.map(upsertSetting));
    console.log("Seeded 'Setting' table ✅");
}
