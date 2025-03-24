import { IsEnum, IsString } from 'class-validator';

enum MethodLoginAsMember {
  VNeID = 'VNeID',
  email = 'email',
  phone = 'phone',
}

export class LoginAsMemberDto {
  @IsEnum(MethodLoginAsMember)
  method: MethodLoginAsMember;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
