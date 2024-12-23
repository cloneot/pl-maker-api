import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '@src/common/decorator/user.decorator';
import { LoggedInGuard } from '@src/auth/logged-in.guard';
import { UserEntity } from '../users/user.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(LoggedInGuard)
  @Post()
  createTag(@User() user: UserEntity, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(user, createTagDto);
  }

  // TODO: for public tags, login is not required
  @UseGuards(LoggedInGuard)
  @Get()
  findTags(@User() user, @Query('musicId') musicId) {
    return this.tagsService.findTags(user, musicId);
  }

  @UseGuards(LoggedInGuard)
  @Patch(':id')
  updateTag(
    @User() user,
    @Param('id') tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.updateTag(user, +tagId, updateTagDto);
  }

  @UseGuards(LoggedInGuard)
  @Delete(':id')
  removeTag(@User() user, @Param('id') tagId: number) {
    return this.tagsService.removeTag(user, +tagId);
  }
}
