import { Exclude, Expose } from 'class-transformer';
import { PlaylistEntity } from 'src/playlists/playlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Expose()
  @Column({ name: 'username', type: 'varchar', length: 64 })
  username: string;

  @Expose()
  @Column({ name: 'google_sub', type: 'varchar', length: 256, unique: true })
  googleSub: string;

  @Exclude()
  @Column({ name: 'access_token', type: 'varchar', length: 2048 })
  accessToken: string;

  @Exclude()
  @Column({ name: 'refresh_token', type: 'varchar', length: 512 })
  refreshToken: string;

  @Exclude()
  @OneToMany(() => PlaylistEntity, (playlistEntity) => playlistEntity.user)
  playlists: PlaylistEntity[];
}
