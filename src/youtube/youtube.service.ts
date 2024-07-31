import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { youtube, youtube_v3 } from '@googleapis/youtube';

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

  // async createPlaylist(
  //   oauth2Client: OAuth2Client,
  //   createPlaylistDto: CreatePlaylistDto,
  // ): Promise<youtube_v3.Schema$Playlist> {
  //   const res = await this.service.playlists.insert({
  //     auth: oauth2Client,
  //     part: ['snippet', 'status'],
  //     requestBody: {
  //       snippet: {
  //         title: createPlaylistDto.title || 'untitled',
  //         description: createPlaylistDto.description || '',
  //         defaultLanguage: createPlaylistDto.defaultLanguage || 'ko',
  //       },
  //       status: {
  //         privacyStatus: createPlaylistDto.privacyStatus || 'private',
  //       },
  //     },
  //   });
  //   return res.data;
  // }

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
    console.log(res.data.items[0]);
    return res.data.items[0];
  }
}
