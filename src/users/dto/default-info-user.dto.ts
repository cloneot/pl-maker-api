import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../users.entity';

export class DefaultUserInfoDto extends PickType(UserEntity, [
  'userId',
  'username',
] as const) {}
