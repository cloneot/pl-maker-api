import { auth } from '@googleapis/youtube';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';
import { Credentials } from 'google-auth-library';

@Injectable()
export class YoutubeGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    // console.log(`youtube guard: isPublic: ${isPublic}`);

    const req = context.switchToHttp().getRequest();
    const oauth2Client = new auth.OAuth2({
      clientId: this.configService.get('oauth.google.clientID'),
      clientSecret: this.configService.get('oauth.google.clientSecret'),
      redirectUri: this.configService.get('oauth.google.callbackURL'),
    });
    oauth2Client.apiKey = this.configService.get('oauth.google.apiKey');
    oauth2Client.credentials.scope =
      this.configService.get('oauth.google.scope');

    req.youtube = {
      isPublic,
      oauth2Client,
    };

    if (isPublic) {
      return true;
    }

    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedException();
      }
      const { accessToken, refreshToken } = user;
      req.youtube.oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: this.configService.get('oauth.google.scope'),
      } as Credentials);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    return true;
  }
}
