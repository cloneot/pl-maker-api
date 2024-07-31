import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export type Youtube = {
  isPublic: boolean;
  oauth2Client: OAuth2Client;
};

export const Youtube = createParamDecorator<unknown, ExecutionContext>(
  (data: unknown, ctx: ExecutionContext): Youtube => {
    const request = ctx.switchToHttp().getRequest();
    return request.youtube as Youtube;
  },
);
