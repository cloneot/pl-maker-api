import { Module } from '@nestjs/common';
import { PlaylistitemsService } from './playlistitems.service';
import { PlaylistitemsController } from './playlistitems.controller';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from 'src/playlists/playlist.entity';
import { MusicEntity } from 'src/music/music.entity';
import { PlaylistitemEntity } from './playlistitem.entity';

@Module({
  imports: [
    YoutubeModule,
    TypeOrmModule.forFeature([PlaylistitemEntity, PlaylistEntity, MusicEntity]),
  ],
  controllers: [PlaylistitemsController],
  providers: [PlaylistitemsService],
})
export class PlaylistitemsModule {}
