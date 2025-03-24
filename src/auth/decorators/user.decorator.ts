import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Đây là một custom decorator, nó sẽ giúp chúng ta lấy thông tin user từ request
export const UserCtx = createParamDecorator(
  (_data: unknown, c: ExecutionContext) => c.switchToHttp().getRequest().user,
);
