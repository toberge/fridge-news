// @flow

import * as React from 'react';
import { Component } from 'react-simplified/lib/index';

class ButtonPrimary extends Component<{
  onClick: () => mixed,
  children?: React.Node,
  disabled?: boolean
}> {
  render() {
    return (
      <button type="button" className="btn btn-primary" onClick={this.props.onClick} disabled={this.props.disabled}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonSuccess extends Component<{
  onClick: () => mixed,
  children?: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonLight extends Component<{
  onClick: () => mixed,
  children?: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-light" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonDanger extends Component<{
  onClick: () => mixed,
  children?: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-danger" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Button widgets
 */
export default class Button {
  static Success = ButtonSuccess;
  static Secondary = ButtonLight;
  static Danger = ButtonDanger;
  static Primary = ButtonPrimary;
}
