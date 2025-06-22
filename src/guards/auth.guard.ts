import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

interface RequestWithSession {
  session?: {
    userId?: number;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    return !!request.session?.userId;
  }
}
