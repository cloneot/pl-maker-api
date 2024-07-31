import { Injectable, NotImplementedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { YoutubeService } from 'src/youtube/youtube.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private readonly youtubeService: YoutubeService,
  ) {}

  findOne(musicId: number) {
    return this.musicRepository.findOne({ where: { musicId } });
  }

  findOneByYtVideoId(ytVideoId: string) {
    return this.musicRepository.findOne({ where: { ytVideoId } });
  }

  findAll() {
    return this.musicRepository.find();
  }

  async create(oauth2Client: OAuth2Client, createMusicDto: CreateMusicDto) {
    const { ytVideoId } = createMusicDto;
    // TODO: check already exists

    const item = await this.youtubeService.listMusic(oauth2Client, ytVideoId);

    return this.musicRepository.save({
      ytVideoId,
      title: item.snippet.title,
      thumbnailPath: item.snippet.thumbnails.default.url,
    });
  }

  findByYtVideoId(ytVideoId: string) {
    return this.musicRepository.findOne({ where: { ytVideoId } });
  }
}
