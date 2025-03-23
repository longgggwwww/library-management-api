import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string; // Thêm trường name

    @IsString()
    code: string; // Thêm trường code

    @IsOptional()
    @IsString()
    description?: string; // Thêm trường description (nếu có)

    @IsOptional()
    @IsString()
    color?: string; // Thêm trường color (nếu có)

    @IsString({ each: true })
    codes: string[]; // Thêm trường codes
}
