import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './common/config/configuration';
import { MusicModule } from '@resources/music/music.module';
import { PlaylistitemsModule } from '@resources/playlistitems/playlistitems.module';
import { PlaylistsModule } from '@resources/playlists/playlists.module';
import { UsersModule } from '@resources/users/users.module';
import { YoutubeModule } from '@common/youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const app_host = configService.get<string>('app.host');
        const db_name = configService.get<string>('db.database');
        console.log(`app host: ${app_host}`);
        console.log(`db name: ${db_name}`);
        return {
          type: 'mysql',
          host: configService.get<string>('db.host'),
          username: configService.get<string>('db.username'),
          password: configService.get<string>('db.password'),
          database: configService.get<string>('db.database'),
          synchronize: configService.get<boolean>('db.synchronize'),
          charset: 'utf8mb4',
          collation: 'utf8mb4_unicode_ci',
          autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    UsersModule,
    AuthModule,
    MusicModule,
    YoutubeModule,
    PlaylistsModule,
    PlaylistitemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
