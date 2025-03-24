import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateInfoDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsString()
  address?: string;
}

export class ResetUserPwdDto {
  @IsString()
  password: string;
}

export class ChangePwdDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
