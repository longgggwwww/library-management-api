import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  code: string; // Mã định danh của thể loại

  @IsString()
  name: string; // Tên của thể loại
}
