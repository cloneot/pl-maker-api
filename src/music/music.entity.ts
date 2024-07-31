import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MusicEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'music_id' })
  musicId: number;

  @Expose()
  @Column({ name: 'yt_video_id', type: 'varchar', length: 64, unique: true })
  ytVideoId: string;

  // TODO: move to official_tag relation (for youtube api test)
  @Expose()
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Expose()
  @Column({ name: 'thumbnail_path', type: 'varchar', length: 255 })
  thumbnailPath: string;
}
