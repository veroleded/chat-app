import { makeAutoObservable } from 'mobx';
import { CurrentUser } from '../models/User';
import UserService from '../services/user-service';

export default class UserStore {
  user?: CurrentUser;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: CurrentUser) {
    this.user = user;
  }

  deleteUser() {
    this.user = undefined;
  }

  setLoading(bol: boolean) {
    this.isLoading = bol;
  }

  async fetchCurrentUser() {
    this.setLoading(true);
    try {
      const { data } = await UserService.getCurrentUser();
      this.setUser(data);
      this.setLoading(false);
    } catch (e) {
      console.log('user-store, fetchCurrentUser', e);
      this.setLoading(false);
    }
  }

  async updateCurrrentUser(payload: Partial<CurrentUser> | { password: string }) {
    this.setLoading(true);
    try {
      const { data } = await UserService.updateCurrentUser(payload);
      this.setUser(data);
      this.setLoading(false);
    } catch (e) {
      console.log('user-auth, updateCurrentUser', e);
      this.setLoading(false);
    }
  }
}
