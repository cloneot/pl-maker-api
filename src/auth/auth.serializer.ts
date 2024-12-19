import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '@resources/users/user.entity';
import { UsersService } from '@resources/users/users.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: CallableFunction) {
    // console.log(`serializeUser: ${JSON.stringify(user)}`);
    const payload = { userId: user.userId, username: user.username };
    done(null, payload);
  }

  async deserializeUser(
    payload: { userId: number; username: string },
    done: CallableFunction,
  ) {
    const user = await this.usersService.findOne(payload.userId);
    // console.log(`deserializeUser: ${JSON.stringify(user)}`);
    done(null, user);
  }
}
