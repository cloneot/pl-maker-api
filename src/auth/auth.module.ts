import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@resources/users/users.module';
import { AuthSerializer } from './auth.serializer';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, GoogleStrategy, AuthSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
