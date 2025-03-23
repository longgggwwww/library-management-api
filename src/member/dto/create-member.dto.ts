import { $Enums } from '@prisma/client';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class CreateMemberDto {
    @IsNotEmpty()
    @IsString()
    VNeID: string; // Mã định danh cá nhân

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsDate()
    birthDate: Date; // Ngày sinh

    @IsNotEmpty()
    @IsString()
    fullName: string; // Họ và tên đầy đủ

    @IsNotEmpty()
    @IsEmail()
    email: string; // Địa chỉ email

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string; // Số điện thoại

    @IsNotEmpty()
    @IsBoolean()
    isLocked: boolean; // Trạng thái khóa tài khoản (true: bị khóa, false: không bị khóa)

    @IsNotEmpty()
    @IsEnum($Enums.Gender)
    gender: $Enums.Gender; // Giới tính (Nam, Nữ, hoặc Khác)

    @IsNotEmpty()
    @IsNumber()
    classId: number; // ID của lớp học

    @IsNotEmpty()
    @IsNumber()
    groupId: number; // ID của nhóm

    @IsNotEmpty()
    @IsNumber()
    schoolYearId: number; // ID của năm học
}
