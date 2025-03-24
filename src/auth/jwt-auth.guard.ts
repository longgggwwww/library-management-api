import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ACCESS } from './decorators/public-endpoint.decorator';

@Injectable()
export class TokenAuthGuard extends AuthGuard('jwt') {
  constructor(private refl: Reflector) {
    super();
  }

  canActivate(c: ExecutionContext) {
    // Kiểm tra xem endpoint có được đánh dấu là public không
    const isAccessPublic = this.refl.getAllAndOverride<boolean>(
      IS_PUBLIC_ACCESS,
      [c.getHandler(), c.getClass()],
    );
    if (isAccessPublic) {
      return true;
    }

    return super.canActivate(c);
  }
}
