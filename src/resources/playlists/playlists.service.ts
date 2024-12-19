import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from './playlist.entity';
import { Repository } from 'typeorm';
import { YoutubeService } from '@common/youtube/youtube.service';
import { UserEntity } from '@resources/users/user.entity';
import { OAuth2Client } from 'google-auth-library';
import {
  ForbiddenResourceAccessException,
  ResourceNotFoundException,
} from '@common/exception/service.exception';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async createPlaylist(
    user: UserEntity,
    oauth2Client: OAuth2Client,
    createPlaylistDto: CreatePlaylistDto,
  ) {
    const ytPlaylistId = (
      await this.youtubeService.insertPlaylist(oauth2Client, createPlaylistDto)
    ).id;
    const playlist = await this.playlistRepository.save({
      user,
      ...createPlaylistDto,
      ytPlaylistId,
    });
    return playlist;
  }

  async findAllPlaylists(user: UserEntity) {
    const playlists = this.playlistRepository.find({
      relations: { user: true },
      where: { user },
    });
    return playlists;
  }

  async findPlaylistById(user: UserEntity, playlistId: number) {
    const playlist = await this.playlistRepository.findOne({
      relations: { user: true },
      where: { playlistId },
    });
    if (!playlist) {
      throw new ResourceNotFoundException('Playlist Not Found');
    }

    // TODO: pass if playlist is public
    if (playlist.user.userId !== user.userId) {
      throw new ForbiddenResourceAccessException(
        'You do not have permission to access this playlist',
      );
    }
    return playlist;
  }

  async updatePlaylist(
    user: UserEntity,
    oauth2Client: OAuth2Client,
    updatePlaylistDto: UpdatePlaylistDto,
    playlistId: number,
  ) {
    const playlist = await this.findPlaylistById(user, playlistId);
    const ytPlaylistId = playlist.ytPlaylistId;
    if (playlist.user.userId !== user.userId) {
      throw new ForbiddenResourceAccessException(
        'You do not have permission to access this playlist',
      );
    }

    this.youtubeService.updatePlaylist(
      oauth2Client,
      updatePlaylistDto,
      ytPlaylistId,
    );
    const updatedPlaylist = await this.playlistRepository.update(playlistId, {
      ...updatePlaylistDto,
    });
    return updatedPlaylist;
  }

  async removePlaylist(
    user: UserEntity,
    oauth2Client: OAuth2Client,
    playlistId: number,
  ) {
    const playlist = await this.findPlaylistById(user, playlistId);
    const ytPlaylistId = playlist.ytPlaylistId;
    if (playlist.user.userId !== user.userId) {
      throw new ForbiddenResourceAccessException(
        'You do not have permission to access this playlist',
      );
    }

    this.youtubeService.deletePlaylist(oauth2Client, ytPlaylistId);
    await this.playlistRepository.delete(playlistId);
  }
}
