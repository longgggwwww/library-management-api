import { IsOptional, IsString } from 'class-validator';

export class CreatePublicationRequestDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  note?: string;
}
