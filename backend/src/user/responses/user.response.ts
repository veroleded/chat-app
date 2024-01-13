import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;
  name: string;

  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
  roles: $Enums.Role[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
