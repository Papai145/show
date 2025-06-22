import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../types/open-jwt-user';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtUser }>();
    return request.user.userId;
  },
);
