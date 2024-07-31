import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import { UsersService as UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { DefaultUserInfoDto } from './dto/default-info-user.dto';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { User } from 'src/decorator/user.decorator';

function userEntityToDefaultUserInfo(user: UserEntity): DefaultUserInfoDto {
  // console.log('User Entity: ', user);
  return plainToClass(DefaultUserInfoDto, instanceToPlain(user), {
    excludeExtraneousValues: true,
  });
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LoggedInGuard)
  @Get('me')
  findMe(@User() user: UserEntity) {
    return userEntityToDefaultUserInfo(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(+id);
    return userEntityToDefaultUserInfo(user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    // TODO: revoke token
    throw new NotImplementedException();
    return this.usersService.remove(+id); // Ensure id is a number
  }
}
