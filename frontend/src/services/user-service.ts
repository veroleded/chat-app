import { AxiosResponse } from 'axios';
import $api from '../api';
import { CurrentUser, User } from '../models/User';

export default class UserService {
  static async getCurrentUser(): Promise<AxiosResponse<CurrentUser>> {
    return $api.get<CurrentUser>('/user');
  }

  static async getUser(idOrEmail: string): Promise<AxiosResponse<User>> {
    return $api.get<User>(`/user/${idOrEmail}`);
  }

  static async updateCurrentUser(payload: Partial<CurrentUser> | { password: string }) {
    return $api.patch<CurrentUser>('/user', payload);
  }
}
