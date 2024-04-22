export interface User {
  id: string;
  name: string;
  lastname: string;
  roles: Roles;
  nickname: string;
  createdAt: Date;
  isActivated: boolean;
  description: string;
  birthday: string;
  avatar: string;
}

export interface CurrentUser extends User {
  email: string;
}

enum Roles {
  'USER',
  'ADMIN',
}
