import { ExecutionContext, createParamDecorator } from '@nestjs/common';
// import { OAuth2Client } from 'google-auth-library';

// export interface User {
//   userId: number;
//   authClient: OAuth2Client;
// }

export const User = createParamDecorator<unknown, ExecutionContext>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
