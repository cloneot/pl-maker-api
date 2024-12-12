import { Exclude, Expose } from 'class-transformer';
import { PlaylistitemEntity } from 'src/playlistitems/playlistitem.entity';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlaylistEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'playlist_id' })
  playlistId: number;

  @Expose()
  @Column({
    name: 'yt_playlist_id',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  ytPlaylistId: string;

  @Expose()
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Expose()
  @Column({ name: 'description', type: 'varchar', length: 512 })
  description: string;

  @Exclude()
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.playlists, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Exclude()
  @OneToMany(() => PlaylistitemEntity, (playlistitem) => playlistitem.playlist)
  playlistitems: PlaylistitemEntity[];
}
