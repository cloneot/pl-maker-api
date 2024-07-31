import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as fileStore from 'session-file-store';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { promisify } from 'util';
import * as passportHttpRequest from 'passport/lib/http/request.js';
import { NextFunction } from 'express';
import { ValidationPipe } from '@nestjs/common';

// promisify passport logIn logOut function
function promisifyPassport(req: any, res: Response, next: NextFunction) {
  // console.log(passportHttpRequest.logIn);
  req.logIn = promisify(passportHttpRequest.logIn);
  req.logOut = promisify(passportHttpRequest.logOut);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://pl-maker.netlify.app'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());
  const FileStore = fileStore(session);
  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: false,
      saveUninitialized: false,
      name: 'connect.sid',
      cookie: {
        httpOnly: true,
        // secure: false, // TODO: true in production
        maxAge: 1000 * 60 * 30,
        // sameSite: ''
      },
      store: new FileStore({
        path: './sessions',
        ttl: 60 * 30,
      }),
    }),
  );

  app.use(promisifyPassport);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
