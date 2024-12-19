import { PickType } from '@nestjs/mapped-types';
import { PlaylistEntity } from '../playlist.entity';

export class CreatePlaylistDto extends PickType(PlaylistEntity, [
  // 'user',
  'title',
  'description',
] as const) {}
