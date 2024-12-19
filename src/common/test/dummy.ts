import { plainToInstance } from 'class-transformer';
import { MusicEntity } from '@resources/music/music.entity';

export const music1: MusicEntity = {
  musicId: 1,
  ytVideoId: 't8P-zdkoeJA',
  title: 'for lovers who hesitate (주저하는 연인들을 위해)',
  thumbnailPath: 'https://i.ytimg.com/vi/t8P-zdkoeJA/default.jpg',
  playlistitems: [],
};

export const music2: MusicEntity = {
  musicId: 2,
  ytVideoId: 'mu9P1pAlQVI',
  title: 'Koitte',
  thumbnailPath: 'https://i.ytimg.com/vi/mu9P1pAlQVI/default.jpg',
  playlistitems: [],
};

export const music3: MusicEntity = {
  musicId: 3,
  ytVideoId: '3a-q7vPa-UU',
  title: 'Viva La Vida',
  thumbnailPath: 'https://i.ytimg.com/vi/3a-q7vPa-UU/default.jpg',
  playlistitems: [],
};

export const exposedMusic1 = plainToInstance(MusicEntity, music1);
export const exposedMusic2 = plainToInstance(MusicEntity, music2);
export const exposedMusic3 = plainToInstance(MusicEntity, music3);
