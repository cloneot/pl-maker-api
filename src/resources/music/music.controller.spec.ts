import { Test, TestingModule } from '@nestjs/testing';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicEntity } from './music.entity';
import {
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
} from '@common/exception/service.exception';
import { plainToInstance } from 'class-transformer';
import { CreateMusicDto } from './dto/create-music.dto';
import { auth } from '@googleapis/youtube';
import { Youtube } from '@common/decorator/youtube.decorator';
import {
  exposedMusic1,
  exposedMusic2,
  music1,
  music2,
} from '@common/test/dummy';
import { YoutubeModule } from '@common/youtube/youtube.module';
import { TypeOrmTestingModule } from '@common/test/typeorm-testing.module';
import { ConfigModule } from '@nestjs/config';

const mockMusicService = {
  findMusicById: jest.fn().mockImplementation(async (musicId: number) => {
    if (musicId === music1.musicId) return exposedMusic1;
    if (musicId === music2.musicId) return exposedMusic2;
    throw new ResourceNotFoundException();
  }),
  findAllMusic: jest.fn().mockResolvedValue([exposedMusic1, exposedMusic2]),
  createMusic: jest
    .fn()
    .mockImplementation(
      async (client, dto: CreateMusicDto): Promise<MusicEntity> => {
        if (
          dto.ytVideoId === music1.ytVideoId ||
          dto.ytVideoId === music2.ytVideoId
        ) {
          throw new ResourceAlreadyExistsException();
        }
        return plainToInstance(MusicEntity, {
          musicId: 99,
          ytVideoId: dto.ytVideoId,
          title: 'some title',
          thumbnailPath: 'some path',
          playlistitems: [],
        });
      },
    ),
};

describe('MusicController', () => {
  let musicController: MusicController;
  let musicService: MusicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        YoutubeModule,
        ...TypeOrmTestingModule([MusicEntity]),
      ],
      controllers: [MusicController],
      providers: [
        {
          provide: MusicService,
          useValue: mockMusicService,
        },
      ],
    }).compile();

    musicController = module.get<MusicController>(MusicController);
    musicService = module.get<MusicService>(MusicService);
  });

  it('should be defined', () => {
    expect(musicController).toBeDefined();
  });

  describe('findMusicById', () => {
    it('should return the music when it exists', async () => {
      await expect(musicController.findMusicById(1)).resolves.toEqual(
        exposedMusic1,
      );
      await expect(musicController.findMusicById(2)).resolves.toEqual(
        exposedMusic2,
      );
    });

    // http 404 error will be thrown by global filter
    it('should throw ExceptionNotFoundException when it does not exist', () => {
      expect(musicController.findMusicById(3)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('findAllMusic', () => {
    it('should return all music', async () => {
      const expected = [exposedMusic1, exposedMusic2];
      const result = await musicController.findAllMusic();
      expect(result).toHaveLength(expected.length);
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('createMusic', () => {
    const yt: Youtube = { isPublic: false, oauth2Client: new auth.OAuth2() };

    it('should create the music when it does not exist', async () => {
      const ytVideoId = 'xxxx-abcd';
      const created = await musicController.createMusic({ ytVideoId }, yt);
      expect(created).toHaveProperty('ytVideoId', ytVideoId);
    });

    // http 409 error will be thrown by global filter
    it('should throw ResourceAlreadyExistsException when it already exists', async () => {
      await expect(
        musicController.createMusic({ ytVideoId: music1.ytVideoId }, yt),
      ).rejects.toThrow(ResourceAlreadyExistsException);

      await expect(
        musicController.createMusic({ ytVideoId: music2.ytVideoId }, yt),
      ).rejects.toThrow(ResourceAlreadyExistsException);
    });
  });
});
