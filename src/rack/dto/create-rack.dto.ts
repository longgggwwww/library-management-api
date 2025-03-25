import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRackDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsInt()
  shelfId: number;

  @IsString()
  @IsOptional()
  descpiption?: string;
}
