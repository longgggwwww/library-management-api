import { IsEnum, IsString } from 'class-validator';

export class LoginAsMemberDto {
  @IsEnum(['VNeID', 'email', 'phone'])
  method: 'VNeID' | 'email' | 'phone';

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
