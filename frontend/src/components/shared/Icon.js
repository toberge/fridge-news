// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import './Icon.css';

class LoadingIcon extends Component {
  render() {
    return <i className="fas fa-spinner fa-fw fa-spin"></i>;
  }
}

class WriteIcon extends Component {
  render() {
    return <i className="fas fa-edit"></i>;
  }
}

class SaveIcon extends Component {
  render() {
    return <i className="fas fa-save"></i>;
  }
}

class UploadIcon extends Component {
  render() {
    return <i className="fas fa-upload"></i>;
  }
}

class SearchIcon extends Component {
  render() {
    return <i className="fas fa-search"></i>;
  }
}

class UserIcon extends Component {
  render() {
    return <i className="fas fa-user"></i>;
  }
}

class EmailIcon extends Component {
  render() {
    return <i className="far fa-envelope"></i>;
  }
}

class DeleteIcon extends Component {
  render() {
    return <i className="fas fa-trash"></i>;
  }
}

export default class Icon {
  static Loading = LoadingIcon;
  static Write = WriteIcon;
  static Upload = UploadIcon;
  static Save = SaveIcon;
  static Delete = DeleteIcon;
  static Search = SearchIcon;
  static User = UserIcon;
  static Email = EmailIcon;
}
