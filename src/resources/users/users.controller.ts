import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import { UsersService as UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { LoggedInGuard } from '@src/auth/logged-in.guard';
import { User } from '@common/decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LoggedInGuard)
  @Get('me')
  findMe(@User() user: UserEntity) {
    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    // TODO: check if user/:id is me
    const user = await this.usersService.findOne(+id);
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    // TODO: revoke token
    throw new NotImplementedException();
    return this.usersService.remove(+id); // Ensure id is a number
  }
}
