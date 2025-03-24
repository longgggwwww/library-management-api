import { $Enums } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  @MaxLength(255)
  code: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsBoolean()
  published: boolean;

  @IsEnum($Enums.PublicationType)
  @MaxLength(50)
  type: $Enums.PublicationType;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  summary?: string;

  @IsString()
  @IsOptional()
  @MaxLength(13)
  isbn?: string;

  @IsDate()
  @IsOptional()
  publishedDate?: Date;

  @IsInt()
  @IsOptional()
  publisherId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  authorIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  genreIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];

  @IsUrl()
  @IsOptional()
  fileUrl?: string;

  @IsInt()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  translator?: string;

  @IsInt()
  @IsOptional()
  volumeNumber?: number;

  @IsOptional()
  @IsInt()
  coverPrice?: number;

  @IsOptional()
  @IsInt()
  pageCount?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  alternateNameIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  hashtagIds?: number[];
}
