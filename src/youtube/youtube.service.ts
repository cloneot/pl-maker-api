import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { youtube, youtube_v3 } from '@googleapis/youtube';
import { CreatePlaylistDto } from 'src/playlists/dto/create-playlist.dto';
import { UpdatePlaylistDto } from 'src/playlists/dto/update-playlist.dto';
import { YtInsertPlaylistitemDto } from 'src/playlistitems/dto/yt-insert-playlistitem.dto';

@Injectable()
export class YoutubeService {
  private service: youtube_v3.Youtube;
  constructor() {
    this.service = youtube('v3');
  }

  async getChannelInfo(
    oauth2Client: OAuth2Client,
  ): Promise<youtube_v3.Schema$Channel> {
    const res = await this.service.channels.list({
      auth: oauth2Client,
      part: ['snippet'],
      fields:
        'items(id, snippet(title, customUrl, thumbnails(default(url)), defaultLanguage))',
      mine: true,
    });
    if (res.data.items.length === 0) {
      throw new Error('no channel info');
    }
    return res.data.items[0];
  }

  async insertPlaylist(
    oauth2Client: OAuth2Client,
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<youtube_v3.Schema$Playlist> {
    const res = await this.service.playlists.insert({
      auth: oauth2Client,
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: createPlaylistDto.title || 'untitled',
          description: createPlaylistDto.description || '',
          defaultLanguage: 'ko',
        },
        status: {
          privacyStatus: 'private',
        },
      },
    });
    return res.data;
  }

  async updatePlaylist(
    oauth2Client: OAuth2Client,
    updatePlaylistDto: UpdatePlaylistDto,
    ytPlaylistId: string,
  ): Promise<youtube_v3.Schema$Playlist> {
    const res = await this.service.playlists.update({
      auth: oauth2Client,
      part: ['snippet'],
      requestBody: {
        id: ytPlaylistId,
        snippet: {
          ...updatePlaylistDto,
        },
      },
    });
    return res.data;
  }

  async deletePlaylist(
    oauth2Client: OAuth2Client,
    ytPlaylistId: string,
  ): Promise<void> {
    await this.service.playlists.delete({
      auth: oauth2Client,
      id: ytPlaylistId,
    });
    return;
  }

  async listMusic(
    oauth2Client: OAuth2Client,
    ytVideoId: string,
  ): Promise<youtube_v3.Schema$Video> {
    const res = await this.service.videos.list({
      auth: oauth2Client,
      part: ['id', 'snippet'],
      id: [ytVideoId],
      fields: 'items(id, snippet(title, thumbnails(default(url))))',
    });
    return res.data.items[0];
  }

  async insertPlaylistItem(
    oauth2Client: OAuth2Client,
    ytInsertPlaylistItemDto: YtInsertPlaylistitemDto,
  ): Promise<youtube_v3.Schema$PlaylistItem> {
    const res = await this.service.playlistItems.insert({
      auth: oauth2Client,
      part: ['snippet'],
      requestBody: {
        snippet: {
          playlistId: ytInsertPlaylistItemDto.ytPlaylistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: ytInsertPlaylistItemDto.ytMusicId,
          },
        },
      },
    });
    return res.data;
  }

  async deletePlaylistItem(
    oauth2Client: OAuth2Client,
    ytPlaylistitemId: string,
  ): Promise<void> {
    await this.service.playlistItems.delete({
      auth: oauth2Client,
      id: ytPlaylistitemId,
    });
  }
}
