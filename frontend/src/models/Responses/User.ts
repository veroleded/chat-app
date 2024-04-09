export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];

  isActivated: boolean;
}
