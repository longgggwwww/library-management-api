import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicEndpoint } from './decorators/public-endpoint.decorator';
import { UserCtx } from './decorators/user.decorator';
import { LoginAsMemberDto, RefreshTokenDto } from './dto/auth-token.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from './types/user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint() // Không cần xác thực để truy cập
  @UseGuards(LocalAuthGuard) // Kiểm tra thông tin đăng nhập
  @Post('login')
  login(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
  ) {
    return this.auth.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint()
  @Post('token/refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto);
  }

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint()
  @Post('login-as-member')
  loginAsMember(@Body() dto: LoginAsMemberDto) {
    return this.auth.loginAsMember(dto);
  }

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint()
  @Post('token/refresh-member')
  refreshTokenAsMember(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshTkAsMember(dto);
  }
}
