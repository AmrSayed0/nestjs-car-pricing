import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

interface RequestWithUser {
  currentUser?: User | null;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): User | null | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.currentUser;
  },
);
