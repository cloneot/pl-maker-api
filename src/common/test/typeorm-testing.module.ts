import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from '@resources/music/music.entity';
import { PlaylistitemEntity } from '@resources/playlistitems/playlistitem.entity';
import { PlaylistEntity } from '@resources/playlists/playlist.entity';
import { UserEntity } from '@resources/users/user.entity';

export const TypeOrmTestingModule = (entities: any[]) => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [UserEntity, MusicEntity, PlaylistEntity, PlaylistitemEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
