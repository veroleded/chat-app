import { makeAutoObservable } from 'mobx';

import { AxiosError } from 'axios';

import AuthService from '../services/auth-service';
import { User } from '../models/Responses/User';

export default class AuthStore {
  isAuth = false;
  isLoading = false;
  error: string | null = null;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setError(errorDescription: string | null) {
    this.error = errorDescription;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  setUser(user: User) {
    this.user = user;
  }

  deleteUser() {
    this.user = null;
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      const { user, accessToken } = response.data;

      localStorage.setItem('token', accessToken);
      this.setUser(user);
      this.setAuth(true);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        if (e.response?.data.statusCode === 500) {
          this.setError('Что-то пошло не так, повторите попытку');
        } else {
          this.setError(e.response?.data.message);
        }
      } else {
        console.log(e);
      }
    }
    this.setLoading(false);
  }

  async registration(email: string, nickname: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.registration(email, nickname, password);
      console.log(response.data);
      const { user, accessToken } = response.data;

      localStorage.setItem('token', accessToken);
      this.setUser(user);
      this.setAuth(true);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        if (e.response?.data.statusCode === 500) {
          this.setError('Что-то пошло не так, повторите попытку');
        } else {
          this.setError(e.response?.data.message);
        }
      } else {
        this.setError('Что-то пошло не так, повторите попытку');
      }
      this.setLoading(false);
    }
  }

  async logout() {
    this.setLoading(true);
    try {
      localStorage.removeItem('token');
      await AuthService.logout();
      this.deleteUser();
      this.setAuth(false);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data);
      } else {
        console.log(e);
      }
    }
    this.setLoading(false);
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await AuthService.refresh();
      const { user, accessToken } = response.data;

      localStorage.setItem('token', accessToken);
      this.setUser(user);
      this.setAuth(true);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
      } else {
        console.log(e);
      }
    }
    this.setLoading(false);
  }

  async sendActivationMail() {
    this.setLoading(true);
    try {
      await AuthService.sendActivationMail();
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e);
        if (e.response?.data.statusCode === 500) {
          this.setError('Что-то пошло не так, повторите попытку');
        } else {
          this.setError(e.response?.data.message);
        }
      } else {
        console.log(e);
      }
    }

    this.setLoading(false);
  }
}
