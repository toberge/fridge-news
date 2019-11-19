// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import Form from '../../shared/Form';
import { createHashHistory } from 'history';
import Notifier from '../../shared/Notifier';
import { userStore } from '../../../stores/userStore';
import './Login.css';
import Icon from '../../shared/Icon';

const history = createHashHistory();

export default class Login extends Component {
  pending: boolean = false;
  name: string = '';
  password: string = '';

  render() {
    return (
      <main>
        <h1>Log In</h1>
        <form onSubmit={this.handleLogIn} style={{ margin: '0 auto', width: '80%' }}>
          <Form.Input
            name="username"
            label="Username"
            placeholder="Your username, please"
            helpText=""
            value={this.name}
            onChange={this.handleUserNameChange}
            inputCols={9}
            required
          />
          <Form.Input
            name="password"
            label="Password"
            type="password"
            placeholder="Your password, please"
            helpText=""
            value={this.password}
            onChange={this.handlePasswordChange}
            inputCols={9}
            required
          />
          <Form.Submit disabled={this.pending}>Log In</Form.Submit>
          {this.pending ? (
            <span>
              {' '}
              <Icon.Loading /> Logging in...
            </span>
          ) : null}
        </form>
      </main>
    );
  }

  handleUserNameChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value !== null && value.length < 64) {
      this.name = value;
      if (value.length < 4) {
        event.target.setCustomValidity('Username must be at least 4 characters long');
      } else {
        event.target.setCustomValidity('');
      }
    } else {
      event.target.setCustomValidity('Username must be no more than 64 letters');
    }
  }

  handlePasswordChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value !== null && value.length < 64) {
      this.password = value;
      if (value.length < 8) {
        event.target.setCustomValidity('Password must be at least 8 characters long');
      } else {
        event.target.setCustomValidity('');
      }
    } else {
      event.target.setCustomValidity('Password must be no more than 64 letters');
    }
  }

  async handleLogIn(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();
    // no need to validate (except image?) - already done by form

    // disable button (+ possible additional effects)
    this.pending = true;

    try {
      if (await userStore.logIn(this.name, this.password)) {
        history.push('/');
        return;
      } else {
        Notifier.error('Logging in failed, unknown error.');
      }
    } catch (e) {
      Notifier.error(`Login failed\n${e.message}`);
    }
    this.pending = false;
  }
}
