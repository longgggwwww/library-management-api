import { IsString } from 'class-validator';

// DTO để tạo một thực thể lớp học
export class CreateClassDto {
  @IsString()
  // Mã duy nhất của lớp học
  code: string;

  @IsString()
  // Tên của lớp học
  name: string;
}
