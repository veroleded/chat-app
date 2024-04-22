import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;
  name: string;

  lastname: string;

  nickname: string;

  @Exclude()
  password: string;

  @Exclude()
  provider: $Enums.Provider;

  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  roles: $Enums.Roles[];

  @Exclude()
  isBlocked: boolean;

  isActivated: boolean;

  @Exclude()
  activationCode: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
  avatar: string;
  description: string;

  birthday: Date;
}
