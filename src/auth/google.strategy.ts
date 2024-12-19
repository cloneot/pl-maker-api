import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@resources/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get('oauth.google.clientID'),
      clientSecret: configService.get('oauth.google.clientSecret'),
      callbackURL: configService.get('oauth.google.callbackURL'),
      scope: configService.get('oauth.google.scope'),
      tokenURL: 'https://oauth2.googleapis.com/token',
      accessType: 'offline',
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, displayName: username } = profile;

    const user = this.usersService.findOrCreate({
      username: username,
      googleSub: id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    done(null, user);
    // return user;
  }
}
