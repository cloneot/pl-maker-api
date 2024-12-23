import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [MusicModule, TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
