import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from '@resources/playlists/playlist.entity';
import { Repository } from 'typeorm';
import { YoutubeService } from '@common/youtube/youtube.service';
import { OAuth2Client } from 'google-auth-library';
import { InsertPlaylistitemDto } from './dto/insert-playlistitem.dto';
import { MusicEntity } from '@resources/music/music.entity';
import { YtInsertPlaylistitemDto } from './dto/yt-insert-playlistitem.dto';
import { PlaylistitemEntity } from './playlistitem.entity';

@Injectable()
export class PlaylistitemsService {
  constructor(
    @InjectRepository(PlaylistitemEntity)
    private readonly playlistitemRepository: Repository<PlaylistitemEntity>,
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async insert(
    oauth2Client: OAuth2Client,
    insertPlaylistitemDto: InsertPlaylistitemDto,
  ) {
    const playlist = await this.playlistRepository.findOneBy({
      playlistId: insertPlaylistitemDto.playlistId,
    });
    const music = await this.musicRepository.findOneBy({
      musicId: insertPlaylistitemDto.musicId,
    });

    // 1. insert video into playlist by using youtube api.
    // TODO: if youtube api fails, handle exception
    const ytInsertPlaylistItemDto: YtInsertPlaylistitemDto = {
      ytPlaylistId: playlist.ytPlaylistId,
      ytMusicId: music.ytVideoId,
    };
    const ytPlaylistitemId = (
      await this.youtubeService.insertPlaylistItem(
        oauth2Client,
        ytInsertPlaylistItemDto,
      )
    ).id!;

    // 2. insert playlistitem in pl-maker db.
    const playlistitem = new PlaylistitemEntity();
    playlistitem.playlist = playlist;
    playlistitem.music = music;
    playlistitem.ytPlaylistitemId = ytPlaylistitemId;

    const saved = await this.playlistitemRepository.save(playlistitem);
    return saved;
  }

  async findAll(playlistId: number) {
    const playlistitems = await this.playlistitemRepository.find({
      relations: ['music'],
      where: { playlist: { playlistId } },
    });
    return playlistitems;
  }

  async remove(oauth2Client: OAuth2Client, playlistitemId: number) {
    const playlistitem = await this.playlistitemRepository.findOne({
      relations: ['playlist', 'music'],
      where: { playlistitemId },
    });

    // 1. delete playlistitem by using youtube api.
    this.youtubeService.deletePlaylistItem(
      oauth2Client,
      playlistitem.ytPlaylistitemId,
    );

    // 2. remove music from pl-maker db.
    await this.playlistitemRepository.delete(playlistitemId);
  }
}
