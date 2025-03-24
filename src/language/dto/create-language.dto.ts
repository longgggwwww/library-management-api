import { IsString } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  code: string; // Mã định danh của ngôn ngữ

  @IsString()
  name: string; // Tên của ngôn ngữ
}
