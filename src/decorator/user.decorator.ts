import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// serializeUser type
export type User = {
  userId: number;
  username: string;
};

export const User = createParamDecorator<unknown, ExecutionContext>(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
