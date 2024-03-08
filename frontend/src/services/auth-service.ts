import { AxiosResponse } from 'axios';
import $api from '../api';
import { AuthResponse } from '../models/Responses';

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/login', { email, password });
  }

  static async registration(
    email: string,
    nickname: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/registration', { email, nickname, password });
  }

  static async refresh() {
    return $api.get<AuthResponse>('/auth/refresh');
  }

  static async logout(): Promise<void> {
    return $api.get('/auth/logout');
  }
}
