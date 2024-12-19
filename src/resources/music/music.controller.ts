import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { Public } from '@common/decorator/public.decorator';
import { YoutubeGuard } from '@common/youtube/youtube.guard';
import { Youtube } from '@common/decorator/youtube.decorator';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':id')
  findMusicById(@Param('id') id: number) {
    return this.musicService.findMusicById(+id);
  }

  @Get()
  findAllMusic() {
    return this.musicService.findAllMusic();
  }

  @Public()
  @UseGuards(YoutubeGuard)
  @Post()
  createMusic(
    @Body() createMusicDto: CreateMusicDto,
    @Youtube() youtube: Youtube,
  ) {
    return this.musicService.createMusic(youtube.oauth2Client, createMusicDto);
  }
}
