import { IsString } from 'class-validator';

// DTO để tạo một thực thể năm học
export class CreateSchoolYearDto {
  @IsString()
  // Mã duy nhất của năm học
  code: string;

  @IsString()
  // Tên của năm học
  name: string;
}
