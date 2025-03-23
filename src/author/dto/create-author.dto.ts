import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
    @IsString()
    code: string; // Mã định danh của tác giả

    @IsString()
    name: string; // Tên của tác giả

    @IsOptional()
    @IsInt()
    birthYear?: number; // Ngày sinh của tác giả (không bắt buộc)

    @IsOptional()
    @IsInt()
    deathYear?: number; // Ngày mất của tác giả (không bắt buộc)

    @IsOptional()
    @IsString()
    nationality?: string; // Quốc tịch của tác giả (không bắt buộc)

    @IsOptional()
    @IsString()
    description?: string; // Mô tả về tác giả (không bắt buộc)
}
