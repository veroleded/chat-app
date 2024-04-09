import { User } from '@prisma/client';
class UserInAuthResponse {
  id: string;
  email: string;
  name: string;
  lastname: string;
  nickname: string;
  roles: string[];
  description: string;
  birthday: Date;

  isActivated: boolean;
  isBlocked: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.lastname = user.lastname;
    this.nickname = user.nickname;
    this.roles = user.roles;
    this.isActivated = user.isActivated;
    this.isBlocked = user.isBlocked;
    this.birthday = user.birthday;
    this.description = user.description;
  }
}

export class AuthResponse {
  accessToken: string;
  user: UserInAuthResponse;

  constructor(user: User, accessToken: string) {
    this.accessToken = accessToken;
    this.user = new UserInAuthResponse(user);
  }
}
