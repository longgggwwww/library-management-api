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

  @HttpCode(HttpStatus.OK) // Trả về status code 200
  @PublicEndpoint() // Endpoint này không cần quyền truy cập
  @UseGuards(LocalAuthGuard) // Sử dụng LocalAuthGuard để kiểm tra thông tin đăng nhập
  @Post('login')
  // Đăng nhập
  login(
    // Lấy thông tin người dùng từ decorator UserCtx
    @UserCtx() user: User,
  ) {
    return this.auth.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint()
  @Post('token/refresh')
  // Lấy token mới
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto);
  }

  @HttpCode(HttpStatus.OK)
  @PublicEndpoint()
  @Post('login-as-member')
  // Đăng nhập với tư cách thành viên
  loginAsMember(@Body() dto: LoginAsMemberDto) {
    return this.auth.loginAsMember(dto);
  }
}
