import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { tokens } from 'src/common/constants/env-keys';

@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const tk = this.extractTokenFromHeader(req);
    if (!tk) {
      throw new UnauthorizedException('Missing access token');
    }
    try {
      const payload = await this.jwt.verifyAsync(tk, {
        secret: tokens.member.accessToken.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      req['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
