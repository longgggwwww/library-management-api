import { IsOptional, IsString } from 'class-validator';

export class CreatePermDto {
  @IsString()
  id: string; // ID

  @IsString()
  name: string; // Tên

  @IsString()
  @IsOptional()
  description?: string; // Mô tả (nếu có)
}
