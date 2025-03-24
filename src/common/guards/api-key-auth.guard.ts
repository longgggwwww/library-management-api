import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { apiKey } from '../constants/env-keys';
import { PUBLIC_API_KEY } from '../decorators/public-api.decorator';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private refl: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const isPublicEndpoint = this.refl.getAllAndOverride<boolean>(
      PUBLIC_API_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    // Nếu là endpoint public thì không cần kiểm tra API key
    if (isPublicEndpoint) {
      return true;
    }

    // Lấy request từ ExecutionContext
    const req = ctx.switchToHttp().getRequest<Request>();
    const reqApiKey = req.headers['x-api-key'] ?? req.query.api_key;

    if (!reqApiKey) {
      throw new ForbiddenException('API key is required');
    }
    if (reqApiKey !== apiKey) {
      throw new ForbiddenException('Invalid API key');
    }

    return true;
  }
}
