// @flow

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { sharedComponentData } from 'react-simplified';
import User from '../data/User';
import Notifier from '../components/shared/Notifier';

class UserStore {
  // login state
  currentUser: ?User;
  token: ?string;
  tokenInterval: ?IntervalID = null;
  // other users
  currentAuthor: User = new User(1, 'The Fridge', true);
  cachedUsers: Map<number, User> = new Map<number, User>();

  loadUser() {
    const username = sessionStorage.getItem('username');
    const id = sessionStorage.getItem('userID');
    const token = sessionStorage.getItem('token');
    if (username && id && token) {
      // set temp user
      this.currentUser = new User(parseInt(id), username, false);
      this.token = token;
      // load user from DB
      this.getUser(parseInt(id))
        .then(user => this.currentUser = user)
        .catch(error => {
          console.log(error);
          this.currentUser = null;
        });
    }
  }

  saveUser() {
    if (this.currentUser && this.token) {
      sessionStorage.setItem('username', this.currentUser.name);
      // excessive checks because Flow is stupid sometimes
      if (this.currentUser) sessionStorage.setItem('userID', `${this.currentUser.id}`);
      if (this.token) sessionStorage.setItem('token', this.token);
    }
  }

  logIn(name: string, password: string) {
    return axios.post('/login', { name, password }).then(async (response: AxiosResponse) => {
      // already okay
      console.log(response.data);
      this.currentUser = await this.getUser(response.data.user_id);
      this.token = response.data.jwt;
      this.startTokenInterval();
      this.saveUser();
      return true;
    });
  }

  /**
   * Just logs off our dear user
   */
  logOut() {
    this.currentUser = null;
    this.token = null;
    sessionStorage.clear();
    clearInterval(this.tokenInterval);
  }

  register(username: string, password: string) {
    return axios.post('/users/', { name: username, password }).then(async response => {
      this.currentUser = await this.getUser(response.data.insertId);
      this.token = response.data.jwt;
      this.startTokenInterval();
      this.saveUser();
      return this.currentUser ? this.currentUser.id : -1; // TODO temp hack...
    });
  }

  getTokenHeader(): AxiosRequestConfig {
    return {
      headers: {
        'x-access-token': userStore.token
      }
    };
  }

  startTokenInterval() {
    this.tokenInterval = setInterval(this.refreshToken, 1000 * 60 * 4);
  }

  refreshToken() {
    axios
      .get('/token/', this.getTokenHeader())
      .then((response: AxiosResponse) => {
        if (response.data.jwt) this.token = response.data.jwt;
        console.log('fetched token...');
      })
      .catch((e: Error) => {
        Notifier.error(`Refreshing token failed, logging out... Error: ${e.message}`);
        this.logOut();
      });
  }

  getUser(id: number): Promise<User> {
    let user = this.cachedUsers.get(id);
    if (user) {
      return new Promise<User>(resolve => resolve(user));
    } else {
      return axios.get('/users/' + id).then(response => {
        const { user_id, name, admin } = response.data;
        const newUser = new User(user_id, name, admin);
        this.cachedUsers.set(id, newUser);
        return newUser;
      });
    }
  }

  getAuthor(id: number) {
    return this.getUser(id).then(user => (this.currentAuthor = user));
  }
}

export const userStore = sharedComponentData(new UserStore());
