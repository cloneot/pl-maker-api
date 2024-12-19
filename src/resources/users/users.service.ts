import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  findOneBySub(googleSub: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { googleSub: googleSub } });
  }

  async findOrCreate(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findOneBySub(createUserDto.googleSub);
    if (!user) {
      return this.create(createUserDto);
    }

    const isTokenUpdated =
      user.accessToken !== createUserDto.accessToken ||
      (createUserDto.refreshToken &&
        user.refreshToken !== createUserDto.refreshToken);
    if (isTokenUpdated) {
      user.accessToken = createUserDto.accessToken;
      user.refreshToken = createUserDto.refreshToken || user.refreshToken;
      return this.userRepository.save(user);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // console.log(createUserDto);
    return this.userRepository.save({
      username: createUserDto.username,
      googleSub: createUserDto.googleSub,
      accessToken: createUserDto.accessToken,
      refreshToken: createUserDto.refreshToken,
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
