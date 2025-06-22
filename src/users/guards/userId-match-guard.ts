import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

export interface AuthenticatedRequest {
  params: Record<string, string>;
  user: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class UserIdMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.params.id !== request.user.userId) {
      throw new ForbiddenException('Вы не можете посмотреть данный профиль');
    }
    return true;
  }
}
