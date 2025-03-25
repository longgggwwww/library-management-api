import { IsOptional, IsString } from 'class-validator';

export class CreateShelfDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  descpiption?: string;
}
