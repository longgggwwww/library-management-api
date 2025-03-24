import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateBranchDto {
  @IsString()
  code: string; // Mã định danh của chi nhánh

  @IsString()
  name: string; // Tên của chi nhánh

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Trạng thái hoạt động của chi nhánh (không bắt buộc)

  @IsOptional()
  @IsString()
  address?: string; // Địa chỉ của chi nhánh (không bắt buộc)

  @IsOptional()
  @IsEmail()
  email?: string; // Email của chi nhánh (không bắt buộc)

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string; // Số điện thoại của chi nhánh (không bắt buộc)

  @IsOptional()
  @IsString()
  website?: string; // Website của chi nhánh (không bắt buộc)
}
