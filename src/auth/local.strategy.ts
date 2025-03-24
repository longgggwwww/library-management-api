import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super();
  }

  // Kiểm tra và trả về user nếu username và password hợp lệ
  async validate(username: string, password: string) {
    const user = await this.auth.validate(username, password);
    if (!user) throw new UnauthorizedException('Invalid username or password');
    return user;
  }
}
