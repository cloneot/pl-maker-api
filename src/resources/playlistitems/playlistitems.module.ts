import { Module } from '@nestjs/common';
import { PlaylistitemsService } from './playlistitems.service';
import { PlaylistitemsController } from './playlistitems.controller';
import { YoutubeModule } from '@common/youtube/youtube.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from '@resources/playlists/playlist.entity';
import { MusicEntity } from '@resources/music/music.entity';
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
