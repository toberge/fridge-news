// @flow

import axios from 'axios';
import { sharedComponentData } from 'react-simplified';
import User from '../data/User';

class UserStore {
  currentUser: ?User;
  loggedIn: boolean = false;
  currentAuthor: User = new User(1, 'The Fridge', true);
  cachedUsers: Map<number, User> = new Map<number, User>();

  logIn(username: string, password: string) {
    // TODO
  }

  logOut() {
    // TODO
  }

  register(username: string, password: string) {
    // TODO
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
    return this.getUser(id).then(user => this.currentAuthor = user);
  }
}

export const userStore = sharedComponentData(new UserStore());
