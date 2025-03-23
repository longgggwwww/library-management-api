import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
    @IsString()
    code: string; // Mã định danh của thể loại

    @IsString()
    name: string; // Tên của thể loại

    @IsOptional()
    @IsString()
    description?: string; // Mô tả thể loại (nếu có)

    @IsOptional()
    @IsInt()
    parentId?: number; // ID của thể loại cha (nếu có)
}
