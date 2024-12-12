import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlaylistitemsService } from './playlistitems.service';
import { InsertPlaylistitemDto } from './dto/insert-playlistitem.dto';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { YoutubeGuard } from 'src/youtube/youtube.guard';
import { User } from 'src/decorator/user.decorator';
import { Youtube } from 'src/decorator/youtube.decorator';

@Controller('playlistitems')
export class PlaylistitemsController {
  constructor(private readonly playlistitemsService: PlaylistitemsService) {}

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Post()
  async insert(
    @User() user,
    @Youtube() youtube: Youtube,
    @Body() insertPlaylistitemDto: InsertPlaylistitemDto,
  ) {
    // TODO: check there is music(:musicid)
    // TODO: check whether user owns playlist
    return this.playlistitemsService.insert(
      youtube.oauth2Client,
      insertPlaylistitemDto,
    );
  }

  // TODO: guest can view public playlist
  @UseGuards(LoggedInGuard)
  @Get()
  findAll(@User() user, @Query('playlistId') playlistId: number) {
    // TODO: check there is music(:musicid)
    // TODO: check whether use owns playlist
    return this.playlistitemsService.findAll(playlistId);
  }

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Delete(':id')
  remove(@User() user, @Youtube() youtube: Youtube, @Param('id') id: number) {
    // TODO: check there is music(:musicid)
    // TODO: check whether use owns playlist
    return this.playlistitemsService.remove(youtube.oauth2Client, id);
  }
}
