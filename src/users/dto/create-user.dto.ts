import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  googleSub: string;

  accessToken: string;
  refreshToken: string | null;
}
