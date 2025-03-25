import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMembershipPlanDto {
  @IsString()
  code: string; // Mã gói tài khoản

  @IsString()
  name: string; // Tên gói tài khoản

  @IsInt()
  fee: number; // Phí gói tài khoản

  @IsInt()
  durationInMonths: number; // Thời hạn sử dụng (tháng)

  @IsString()
  @IsOptional()
  description: string; // Mô tả gói tài khoản (không bắt buộc)

  @IsInt()
  membershipGroupId: number; // ID nhóm thành viên
}
