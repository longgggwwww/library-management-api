import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_BRANCH_KEY } from './decorators/public-branch.decorator';

@Injectable()
// Guard này sẽ kiểm tra xem người dùng có branchId không
export class BranchAccessGuard implements CanActivate {
  constructor(private refl: Reflector) {}

  canActivate(c: ExecutionContext) {
    const isBranchPublic = this.refl.getAllAndOverride<boolean>(
      IS_PUBLIC_BRANCH_KEY,
      [c.getHandler(), c.getClass()],
    );
    if (isBranchPublic) {
      return true;
    }

    // Kiểm tra xem người dùng có branchId không
    const req = c.switchToHttp().getRequest();
    if (req.user) {
      if (!req.user.branchId) {
        throw new ForbiddenException('Branch access denied');
      }
      return true;
    }
  }
}
