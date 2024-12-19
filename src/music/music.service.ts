import { Injectable, NotImplementedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MusicEntity } from './music.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { YoutubeService } from 'src/youtube/youtube.service';
import { OAuth2Client } from 'google-auth-library';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from 'src/common/exception/service.exception';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async findMusicById(musicId: number) {
    const music = await this.musicRepository.findOne({ where: { musicId } });
    if (!music) {
      throw new EntityNotFoundException(`Music Not Found`);
    }
    return music;
  }

  findAllMusic() {
    return this.musicRepository.find();
  }

  async createMusic(
    oauth2Client: OAuth2Client,
    createMusicDto: CreateMusicDto,
  ) {
    const { ytVideoId } = createMusicDto;
    const music = await this.musicRepository.findOne({
      where: { ytVideoId },
    });
    if (music) {
      throw new EntityAlreadyExistsException(`Music Already Exists`);
    }

    const item = await this.youtubeService.listMusic(oauth2Client, ytVideoId);
    return this.musicRepository.save({
      ytVideoId,
      title: item.snippet.title,
      thumbnailPath: item.snippet.thumbnails.default.url,
    });
  }
}
