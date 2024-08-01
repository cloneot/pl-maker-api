import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { User } from 'src/decorator/user.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { UserEntity } from 'src/users/user.entity';
import { Youtube } from 'src/decorator/youtube.decorator';
import { YoutubeGuard } from 'src/youtube/youtube.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Post()
  create(
    @User() user: UserEntity,
    @Youtube() youtube: Youtube,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistsService.create(
      user,
      youtube.oauth2Client,
      createPlaylistDto,
    );
  }

  @UseGuards(LoggedInGuard)
  @Get()
  findAll(@User() user) {
    return this.playlistsService.findAll(user);
  }

  @UseGuards(LoggedInGuard)
  @Get(':id')
  findOne(@Param('id') id: number, @User() user) {
    return this.playlistsService.findOne(user, id);
  }

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Patch(':id')
  update(
    @User() user: UserEntity,
    @Youtube() youtube: Youtube,
    @Param('id') id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(
      user,
      youtube.oauth2Client,
      updatePlaylistDto,
      id,
    );
  }

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Delete(':id')
  remove(@Youtube() youtube: Youtube, @Param('id') id: number) {
    return this.playlistsService.remove(youtube.oauth2Client, id);
  }
}
