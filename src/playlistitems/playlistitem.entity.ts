import { Exclude, Expose } from 'class-transformer';
import { MusicEntity } from 'src/music/music.entity';
import { PlaylistEntity } from 'src/playlists/playlist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlaylistitemEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'playlistitem_id' })
  playlistitemId: number;

  @Expose()
  @Column({
    name: 'yt_playlistitem_id',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  ytPlaylistitemId: string;

  @Exclude()
  @ManyToOne(() => MusicEntity, (music) => music.playlistitems)
  music: MusicEntity;

  @Exclude()
  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.playlistitems)
  playlist: PlaylistEntity;
}
