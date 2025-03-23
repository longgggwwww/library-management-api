import { IsInt, IsOptional, IsString } from 'class-validator';

// DTO để tạo một thực thể nhóm thành viên
export class CreateMemberGroupDto {
    @IsString()
    // Mã duy nhất của nhóm thành viên
    code: string;

    @IsString()
    // Tên của nhóm thành viên
    name: string;

    @IsInt()
    // Số lượng tối đa các mục có thể mượn
    maxBorrowedItems: number;

    @IsInt()
    // Số ngày tối đa có thể mượn
    maxBorrowDays: number;

    @IsInt()
    // Số lượng yêu cầu mượn tối đa được phép
    maxBorrowRequests: number;

    @IsString()
    @IsOptional()
    // Mô tả tùy chọn của nhóm thành viên
    description: string;
}
