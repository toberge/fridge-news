// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { ArticleBase, capitalizeFirstLetter } from '../utils/Article';
import placeholderImage from '../assets/images/floppy.jpg';
// Current placeholder is public domain and does not require contribution.
// Regardless, here's where I found it: https://www.pexels.com/photo/office-disk-storage-data-41290/
// and where it seems to be from: https://www.publicdomainpictures.net/en/view-image.php?image=14548

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
export class Button {
  static Success = ButtonSuccess;
  static Light = ButtonLight;
  static Danger = ButtonDanger;
  static Primary = ButtonPrimary;
}

class FormInput extends Component<{ type?: string, value: string, onChange: () => void }> {
  render() {
    return (
      <input
        type={this.props.type ? this.props.type : 'text'}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

export class FormGroup extends Component<{ children: React.Node }> {
  render() {
    return <div className="form-group">{this.props.children}</div>;
  }
}

export class Form extends Component<{ children: React.Node }> {
  static Input = FormInput;
  static Group = FormGroup;

  render() {
    return <form>{this.props.children}</form>;
  }
}
