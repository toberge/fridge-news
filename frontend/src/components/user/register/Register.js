// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { Link } from 'react-router-dom';
import Form from '../../shared/Form';
import { createHashHistory } from 'history';
import Notifier from '../../shared/Notifier';
import { userStore } from '../../../stores/userStore';
import Icon from '../../shared/Icon';

const history = createHashHistory();

export default class Register extends Component {
  pending: boolean = false;
  name: string = '';
  password: string = '';
  secondPassword: string = '';

  render() {
    return (
      <main>
        <h1>Register</h1>
        <form onSubmit={this.handleRegister} style={{ margin: '0 auto', width: '80%' }}>
          <p>Already have an account? You can <Link to="/login">log in here</Link>.</p>
          <Form.Input
            name="username"
            label="Username"
            placeholder="Your (nick)name"
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
            placeholder="A stronk password"
            helpText=""
            value={this.password}
            onChange={this.handlePasswordChange}
            inputCols={9}
            required
          />
          <Form.Input
            name="password-confirm"
            label="Confirm"
            type="password"
            placeholder="The same password"
            helpText=""
            value={this.secondPassword}
            onChange={this.handleSecondPasswordChange}
            inputCols={9}
            required
          />
          <Form.Submit disabled={this.pending}>Register</Form.Submit>
          {this.pending ? (
            <span>
              {' '}
              <Icon.Loading /> Registering your account...
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

  handleSecondPasswordChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value !== null && value.length < 64) {
      this.secondPassword = value;
      if (this.secondPassword !== this.password) {
        event.target.setCustomValidity('Passwords do not match');
      } else {
        event.target.setCustomValidity('');
      }
    } else {
      event.target.setCustomValidity('Please retype your password');
    }
  }

  async handleRegister(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();
    // no need to validate (except image?) - already done by form

    // disable button (+ possible additional effects)
    this.pending = true;

    try {
      if (await userStore.register(this.name, this.password)) {
        history.push('/');
        return;
      } else {
        Notifier.error('Registration failed, unknown error.');
      }
    } catch (e) {
      if (e.message.includes('403')) {
        Notifier.error('Username already exists');
      } else {
        Notifier.error(`Registration failed\n${e.message}`);
      }
    }
    this.pending = false;
  }
}
