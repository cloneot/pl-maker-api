import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as fileStore from 'session-file-store';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { promisify } from 'util';
import * as passportHttpRequest from 'passport/lib/http/request.js';
import { NextFunction } from 'express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception/service-exception.to.http-exception.filter';

// promisify passport logIn logOut function
function promisifyPassport(req: any, res: Response, next: NextFunction) {
  req.logIn = promisify(passportHttpRequest.logIn);
  req.logOut = promisify(passportHttpRequest.logOut);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    process.env.NODE_ENV === 'production'
      ? {
          httpsOptions: {
            key: fs.readFileSync(
              '/etc/letsencrypt/live/cloneot.dev/privkey.pem',
            ),
            cert: fs.readFileSync(
              '/etc/letsencrypt/live/cloneot.dev/fullchain.pem',
            ),
          },
        }
      : {},
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'https://pl-maker.netlify.app'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());

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
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
        maxAge: 1000 * 60 * 30,
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
