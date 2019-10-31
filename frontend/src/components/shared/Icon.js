// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import './icon.css';

class LoadingIcon extends Component {
  render() {
    return (
      <i className="fas fa-spinner fa-fw fa-spin-slow"></i>
    );
  }
}

class WriteIcon extends Component {
  render() {
    return (
      <i className="fas fa-edit"></i>
    );
  }
}

class SearchIcon extends Component {
  render() {
    return (
      <i className="fas fa-search"></i>
    );
  }
}

class UserIcon extends Component {
  render() {
    return (
      <i className="fas fa-user"></i>
    );
  }
}

export default class Icon {
  static Loading = LoadingIcon;
  static Write = WriteIcon;
  static Search = SearchIcon;
  static User = UserIcon;
}