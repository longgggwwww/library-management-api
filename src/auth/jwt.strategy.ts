import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private conf: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: conf.get('ACCESS_TOKEN_SECRET'),
        });
    }

    // Kiểm tra và trả về user nếu token hợp lệ
    async validate(user: User) {
        return user;
    }
}
