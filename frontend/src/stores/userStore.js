// @flow

import axios, {AxiosResponse} from 'axios';
import { sharedComponentData } from 'react-simplified';
import User from '../data/User';

class UserStore {
  currentUser: ?User;
  token: ?string;
  loggedIn: boolean = false;
  currentAuthor: User = new User(1, 'The Fridge', true);
  cachedUsers: Map<number, User> = new Map<number, User>();

  logIn(name: string, password: string) {
    return axios.post('/login', { name, password })
      .then(async (response: AxiosResponse) => {
        // already okay
        this.currentUser = await this.getUser(response.data.insertId);
        this.token = response.data.jwt;
        this.loggedIn = true;
        console.log('receievedd', this.token);
      })
  }

  logOut() {
    // TODO but not really much to do server-side...
    this.loggedIn = false;
    this.currentUser = null;
    this.token = null;
  }

  register(username: string, password: string) {
    return axios.post('/users/', {name: username, password})
      .then(async response => {
        // TODO token...
        this.currentUser = await this.getUser(response.data.insertId);
        this.token = response.data.jwt;
        this.loggedIn = true;
        return this.currentUser.id;
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
