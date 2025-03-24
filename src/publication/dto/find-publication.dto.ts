import { $Enums } from '@prisma/client';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class FindPublicationDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsOptional()
  take?: number;

  @IsInt()
  @IsOptional()
  skip?: number;

  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  type?: $Enums.PublicationType;

  @IsArray()
  @IsOptional()
  hashtagIds?: number[];
}
