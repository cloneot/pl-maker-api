import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MusicModule } from './music/music.module';
import { YoutubeModule } from './youtube/youtube.module';
import { PlaylistsModule } from './playlists/playlists.module';
import configuration from './common/config/configuration';
import { PlaylistitemsModule } from './playlistitems/playlistitems.module';

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
