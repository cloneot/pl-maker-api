import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import {
  ForbiddenResourceAccessException,
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
} from '@src/common/exception/service.exception';
import { UserEntity } from '../users/user.entity';
import { MusicService } from '../music/music.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly musicService: MusicService,
  ) {}

  async createTag(user: UserEntity, createTagDto: CreateTagDto) {
    const music = await this.musicService.findMusicById(createTagDto.musicId);
    const exists = await this.tagRepository.find({
      relations: { user: true, music: true },
      where: { user, music, tagName: createTagDto.tagName },
    });
    if (exists) {
      throw new ResourceAlreadyExistsException('Tag Already Exists');
    }

    const value = {
      valueType: createTagDto.valueType,
      intValue:
        createTagDto.valueType === 'number'
          ? (createTagDto.value as number)
          : null,
      strValue:
        createTagDto.valueType === 'string'
          ? (createTagDto.value as string)
          : null,
    };
    const tag = await this.tagRepository.save({
      user,
      music,
      tagName: createTagDto.tagName,
      ...value,
    });
    return tag;
  }

  findTags(user: UserEntity, musicId: number) {
    const tags = this.tagRepository.find({
      relations: { user: true, music: true },
      where: { user, music: { musicId } },
    });
    return tags;
  }

  findTagById(tagId: number) {
    const tag = this.tagRepository.findOne({
      relations: { user: true },
      where: { tagId },
    });
    if (!tag) {
      throw new ResourceNotFoundException('Tag Not Found');
    }
    return tag;
  }

  async updateTag(user: UserEntity, tagId: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findTagById(tagId);
    if (user.userId !== tag.user.userId) {
      throw new ForbiddenResourceAccessException(
        'You do not have permission to update this tag',
      );
    }
    const value = {
      valueType: updateTagDto.valueType,
      intValue:
        updateTagDto.valueType === 'number'
          ? (updateTagDto.value as number)
          : null,
      strValue:
        updateTagDto.valueType === 'string'
          ? (updateTagDto.value as string)
          : null,
    };
    tag.valueType = value.valueType;
    tag.intValue = value.intValue;
    tag.strValue = value.strValue;
    await this.tagRepository.save(tag);
  }

  async removeTag(user: UserEntity, tagId: number) {
    const tag = await this.findTagById(tagId);
    if (user.userId !== tag.user.userId) {
      throw new ForbiddenResourceAccessException(
        'You do not have permission to remove this tag',
      );
    }
    await this.tagRepository.delete(tag);
  }
}
