import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(GoogleAuthGuard)
  @Post('login')
  login() {}

  @UseGuards(GoogleAuthGuard)
  @Redirect()
  @Get('callback')
  callback() {
    return {
      url: this.configService.get('frontend.url'),
    };
  }

  @Post('logout')
  @Redirect()
  async logout(@Req() req) {
    await req.logOut();
    return {
      url: this.configService.get('frontend.url'),
    };
  }
}
