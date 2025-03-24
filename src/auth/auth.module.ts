import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'nestjs-prisma';
import {
    accessTokenSecret,
    accessTokenTTL,
} from 'src/common/constants/env-keys';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        PassportModule,
        // Cấu hình module JwtModule để sử dụng JWT
        JwtModule.register({
            secret: accessTokenSecret,
            signOptions: {
                expiresIn: accessTokenTTL,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        LocalStrategy, // Sử dụng chiến lược xác thực Local
        JwtStrategy, // Sử dụng chiến lược xác thực JWT
        PrismaService,
        AuthService,
        UserService,
    ],
})
export class AuthModule {}
