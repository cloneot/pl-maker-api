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
import { User } from 'src/common/decorator/user.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { UserEntity } from 'src/users/user.entity';
import { Youtube } from 'src/common/decorator/youtube.decorator';
import { YoutubeGuard } from 'src/youtube/youtube.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Post()
  createPlaylist(
    @User() user: UserEntity,
    @Youtube() youtube: Youtube,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistsService.createPlaylist(
      user,
      youtube.oauth2Client,
      createPlaylistDto,
    );
  }

  @UseGuards(LoggedInGuard)
  @Get()
  findAllPlaylists(@User() user) {
    return this.playlistsService.findAllPlaylists(user);
  }

  @UseGuards(LoggedInGuard)
  @Get(':id')
  findPlaylistById(@User() user, @Param('id') id: number) {
    return this.playlistsService.findPlaylistById(user, id);
  }

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Patch(':id')
  updatePlaylist(
    @User() user: UserEntity,
    @Youtube() youtube: Youtube,
    @Param('id') id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.updatePlaylist(
      user,
      youtube.oauth2Client,
      updatePlaylistDto,
      id,
    );
  }

  @UseGuards(LoggedInGuard, YoutubeGuard)
  @Delete(':id')
  removePlaylist(
    @User() user: UserEntity,
    @Youtube() youtube: Youtube,
    @Param('id') id: number,
  ) {
    return this.playlistsService.removePlaylist(user, youtube.oauth2Client, id);
  }
}
