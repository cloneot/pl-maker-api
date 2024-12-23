import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { MusicEntity } from '../music/music.entity';

@Entity()
export class TagEntity {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Expose()
  @Column({ name: 'tag_name', type: 'varchar', length: 255 })
  tagName: string;

  @Expose()
  @Column({ name: 'value_type', type: 'varchar', length: 32 })
  valueType: string;

  @Expose()
  @Column({ name: 'int_value', nullable: true, type: 'int' })
  intValue?: number;

  @Expose()
  @Column({ name: 'str_value', nullable: true, type: 'varchar', length: 255 })
  strValue?: string;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.tags, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Exclude()
  @ManyToOne(() => MusicEntity, (music) => music.tags, { onDelete: 'CASCADE' })
  music: MusicEntity;
}
