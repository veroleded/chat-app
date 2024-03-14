import { makeAutoObservable } from 'mobx';

import { AxiosError } from 'axios';

import AuthService from '../services/auth-service';

export default class AuthStore {
  isAuth = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setError(errorDescription: string) {
    this.error = errorDescription;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      const token = response.data.accessToken;

      localStorage.setItem('token', token);
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
      const token = response.data.accessToken;

      localStorage.setItem('token', token);
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
      const token = response.data.accessToken;

      localStorage.setItem('token', token);
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
}
