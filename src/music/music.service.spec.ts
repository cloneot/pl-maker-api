import { Test, TestingModule } from '@nestjs/testing';
import { MusicService } from './music.service';
import { MusicEntity } from './music.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from '../common/exception/service.exception';
import { TypeOrmTestingModule } from 'src/common/test/typeorm-testing.module';
import { YoutubeService } from 'src/youtube/youtube.service';
import { auth } from '@googleapis/youtube';
import { YoutubeModule } from 'src/youtube/youtube.module';
import {
  exposedMusic1,
  exposedMusic2,
  exposedMusic3,
  music1,
  music2,
  music3,
} from 'src/common/test/dummy';
import { CreateMusicDto } from './dto/create-music.dto';

describe('MusicService', () => {
  let musicService: MusicService;
  let youtubeService: YoutubeService;
  let musicRepository: Repository<MusicEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, ...TypeOrmTestingModule([MusicEntity])],
      providers: [MusicService],
    }).compile();

    musicService = module.get<MusicService>(MusicService);
    youtubeService = module.get<YoutubeService>(YoutubeService);
    musicRepository = module.get<Repository<MusicEntity>>(
      getRepositoryToken(MusicEntity),
    );

    musicRepository.clear();
    const created1 = await musicRepository.save(music1);
    const created2 = await musicRepository.save(music2);
    if (
      created1.musicId !== music1.musicId ||
      created2.musicId !== music2.musicId
    ) {
      throw new Error('beforeEach failed: unintended `musicId`');
    }
  });

  it('should be defined', () => {
    expect(musicService).toBeDefined();
  });

  describe('findMusicById', () => {
    it('should return the music when it exists', () => {
      expect(musicService.findMusicById(music1.musicId)).resolves.toEqual(
        exposedMusic1,
      );
      expect(musicService.findMusicById(music2.musicId)).resolves.toEqual(
        exposedMusic2,
      );
    });

    it('should throw EntityNotFoundException when it does not exist', async () => {
      expect(musicService.findMusicById(-1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('findAllMusic', () => {
    it('should return all music', async () => {
      const expected = [exposedMusic1, exposedMusic2];
      const result = await musicService.findAllMusic();
      expect(result).toHaveLength(expected.length);
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('createMusic', () => {
    const client = new auth.OAuth2();
    const dto1: CreateMusicDto = { ytVideoId: music1.ytVideoId };
    const dto3: CreateMusicDto = { ytVideoId: music3.ytVideoId };

    it('should create the music when it does not exist', async () => {
      jest.spyOn(youtubeService, 'listMusic').mockResolvedValueOnce({
        id: music3.ytVideoId,
        snippet: {
          title: music3.title,
          thumbnails: {
            default: {
              url: music3.thumbnailPath,
            },
          },
        },
      });

      const expected = exposedMusic3;
      const result = await musicService.createMusic(client, dto3);

      expect(result).toEqual(expected);
      expect(youtubeService.listMusic).toHaveBeenCalled();
      expect(youtubeService.listMusic).toHaveBeenCalledWith(
        client,
        dto3.ytVideoId,
      );
    });

    it('should throw EntityAlreadyExistsException when it already exists', async () => {
      const ytListMusicApi = jest.spyOn(youtubeService, 'listMusic');
      expect(musicService.createMusic(client, dto1)).rejects.toThrow(
        EntityAlreadyExistsException,
      );
      expect(ytListMusicApi).toHaveBeenCalledTimes(0);
    });
  });
});
