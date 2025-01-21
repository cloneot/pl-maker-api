import { plainToInstance } from 'class-transformer';
import { MusicEntity } from '@resources/music/music.entity';
import { PlaylistEntity } from '@src/resources/playlists/playlist.entity';
import { UserEntity } from '@src/resources/users/user.entity';

// Music
export const music1: MusicEntity = {
  musicId: 1,
  ytVideoId: 't8P-zdkoeJA',
  title: 'for lovers who hesitate (주저하는 연인들을 위해)',
  thumbnailPath: 'https://i.ytimg.com/vi/t8P-zdkoeJA/default.jpg',
  playlistitems: [],
  tags: [],
};
export const music2: MusicEntity = {
  musicId: 2,
  ytVideoId: 'mu9P1pAlQVI',
  title: 'Koitte',
  thumbnailPath: 'https://i.ytimg.com/vi/mu9P1pAlQVI/default.jpg',
  playlistitems: [],
  tags: [],
};
export const music3: MusicEntity = {
  musicId: 3,
  ytVideoId: '3a-q7vPa-UU',
  title: 'Viva La Vida',
  thumbnailPath: 'https://i.ytimg.com/vi/3a-q7vPa-UU/default.jpg',
  playlistitems: [],
  tags: [],
};
export const exposedMusic1 = plainToInstance(MusicEntity, music1);
export const exposedMusic2 = plainToInstance(MusicEntity, music2);
export const exposedMusic3 = plainToInstance(MusicEntity, music3);

// Users
export const user1: UserEntity = {
  userId: 1,
  username: 'user1',
  googleSub: 'GOOGLE-SUB1',
  accessToken: 'ACCESS-TOKEN1',
  refreshToken: 'REFRESH-TOKEN1',
  playlists: [],
  tags: [],
};
export const user2: UserEntity = {
  userId: 2,
  username: 'user2',
  googleSub: 'GOOGLE-SUB2',
  accessToken: 'ACCESS-TOKEN2',
  refreshToken: 'REFRESH-TOKEN2',
  playlists: [],
  tags: [],
};
export const exposedUser1 = plainToInstance(UserEntity, user1);
export const exposedUser2 = plainToInstance(UserEntity, user2);

// Playlists
export const playlist1: PlaylistEntity = {
  playlistId: 1,
  ytPlaylistId: 'YT-PLAYLIST-ID1',
  title: 'My Playlist',
  description: 'My favorite songs',
  user: user1,
  playlistitems: [],
};
export const playlist2: PlaylistEntity = {
  playlistId: 2,
  ytPlaylistId: 'YT-PLAYLIST-ID2',
  title: 'My Playlist2',
  description: 'My favorite songs2',
  user: user2,
  playlistitems: [],
};
export const playlist3: PlaylistEntity = {
  playlistId: 3,
  ytPlaylistId: 'YT-PLAYLIST-ID3',
  title: 'My Playlist3',
  description: 'My favorite songs3',
  user: user1,
  playlistitems: [],
};
export const exposedPlaylist1 = plainToInstance(PlaylistEntity, playlist1);
export const exposedPlaylist2 = plainToInstance(PlaylistEntity, playlist2);
