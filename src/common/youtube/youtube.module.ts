import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { UsersModule } from '@resources/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
