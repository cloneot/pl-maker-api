import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicEntity } from './music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeModule } from 'src/youtube/youtube.module';

@Module({
  imports: [YoutubeModule, TypeOrmModule.forFeature([MusicEntity])],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
