import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from 'src/music/music.entity';
import { PlaylistitemEntity } from 'src/playlistitems/playlistitem.entity';
import { PlaylistEntity } from 'src/playlists/playlist.entity';
import { UserEntity } from 'src/users/user.entity';

export const TypeOrmTestingModule = (entities: any[]) => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [UserEntity, MusicEntity, PlaylistEntity, PlaylistitemEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
