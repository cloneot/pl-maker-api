import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from './playlist.entity';
import { Repository } from 'typeorm';
import { YoutubeService } from 'src/youtube/youtube.service';
import { UserEntity } from 'src/users/user.entity';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async create(
    user: UserEntity,
    oauth2Client: OAuth2Client,
    createPlaylistDto: CreatePlaylistDto,
  ) {
    const ytPlaylistId = (
      await this.youtubeService.createPlaylist(oauth2Client, createPlaylistDto)
    ).id;
    const playlist = await this.playlistRepository.save({
      user,
      ...createPlaylistDto,
      ytPlaylistId,
    });
    return playlist;
  }

  async findAll(user: UserEntity) {
    const playlists = this.playlistRepository.find({
      relations: { user: true },
      where: { user },
    });
    // console.log('playlist.service: findAll: ', playlists);
    return playlists;
  }

  // TODO:
  // parameter: only id
  // possesion check have to be separated
  findOne(user: UserEntity, id: number) {
    const playlist = this.playlistRepository.findOneOrFail({
      relations: { user: true },
      where: { playlistId: id, user: user },
    });
    // console.log('playlist.service: findOne: ', playlist);
    return playlist;
  }

  async update(
    user: UserEntity,
    oauth2Client: OAuth2Client,
    updatePlaylistDto: UpdatePlaylistDto,
    id: number,
  ) {
    const playlist = await this.findOne(user, id);
    const ytPlaylistId = playlist.ytPlaylistId;

    this.youtubeService.updatePlaylist(
      oauth2Client,
      updatePlaylistDto,
      ytPlaylistId,
    );

    const updatedPlaylist = await this.playlistRepository.update(id, {
      ...updatePlaylistDto,
    });
    return updatedPlaylist;
  }

  async remove(oauth2Client: OAuth2Client, id: number) {
    // remove from youtube
    const { ytPlaylistId } = await this.playlistRepository.findOneOrFail({
      where: {
        playlistId: id,
      },
    });
    this.youtubeService.deletePlaylist(oauth2Client, ytPlaylistId);

    // remove from db
    await this.playlistRepository.delete(id);
  }
}
