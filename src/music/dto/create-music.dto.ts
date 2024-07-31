import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { MusicEntity } from '../music.entity';

export class CreateMusicDto extends PickType(MusicEntity, [
  'ytVideoId',
  // 'title',
  // 'thumbnailPath',
] as const) {}
