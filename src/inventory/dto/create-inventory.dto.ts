import { IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
    @IsString()
    code: string; // Mã định danh của kho

    @IsString()
    name: string; // Tên của kho

    @IsOptional()
    @IsString()
    description?: string; // Mô tả kho (nếu có)
}
