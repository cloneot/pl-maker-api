import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService as UsersService } from './users.service';
import { Users } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): Promise<Users[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Users> {
    return this.userService.findOne(+id); // Ensure id is a number
  }

  @Post()
  create(@Body() user: Users): Promise<Users> {
    return this.userService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(+id); // Ensure id is a number
  }
}
