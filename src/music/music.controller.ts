import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { Public } from 'src/decorator/public.decorator';
import { YoutubeGuard } from 'src/youtube/youtube.guard';
import { Youtube } from 'src/decorator/youtube.decorator';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.musicService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Get('youtube/:ytVideoId')
  findByYtVideoId(@Param('ytVideoId') ytVideoId: string) {
    return this.musicService.findByYtVideoId(ytVideoId);
  }

  @Public()
  @UseGuards(YoutubeGuard)
  @Post()
  create(@Body() createMusicDto: CreateMusicDto, @Youtube() youtube: Youtube) {
    return this.musicService.create(youtube.oauth2Client, createMusicDto);
  }
}
