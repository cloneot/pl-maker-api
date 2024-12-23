import { Exclude, Expose } from 'class-transformer';
import { PlaylistitemEntity } from '@resources/playlistitems/playlistitem.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TagEntity } from '../tags/tag.entity';

@Entity()
export class MusicEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'music_id' })
  musicId: number;

  @Expose()
  @Column({ name: 'yt_video_id', type: 'varchar', length: 255, unique: true })
  ytVideoId: string;

  // TODO: move to official_tag relation (for youtube api test)
  @Expose()
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Expose()
  @Column({ name: 'thumbnail_path', type: 'varchar', length: 255 })
  thumbnailPath: string;

  @Exclude()
  @OneToMany(() => PlaylistitemEntity, (playlistitem) => playlistitem.music)
  playlistitems: PlaylistitemEntity[];

  @Exclude()
  @OneToMany(() => TagEntity, (tag) => tag.music)
  tags: TagEntity[];
}
