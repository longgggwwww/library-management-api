import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/auth/types/user.type';
import { Permissions } from 'src/permission/permissions.enum';
import { PERMISSIONS_KEY } from './decorators/permit.decorator';

type Permission = keyof typeof Permissions;

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private refl: Reflector) {}

  canActivate(c: ExecutionContext) {
    const permList = this.refl.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [c.getHandler(), c.getClass()],
    );
    if (!permList || permList.length === 0) {
      // Nếu không có quyền truy cập nào được đặt
      return true;
    }

    // Lấy danh sách quyền truy cập của người dùng
    const { permissions } = c.switchToHttp().getRequest<{ user: User }>().user;
    // Kiểm tra xem người dùng có quyền truy cập không
    const hasPerm = permList.some((perm) => permissions.includes(perm));
    if (!hasPerm) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
