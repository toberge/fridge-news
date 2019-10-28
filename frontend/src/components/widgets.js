// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { ArticleBase } from '../utils/Article';

export class Card extends Component<{
  title: string,
  children: React.ChildrenArray<React.Node>
}> {
  render() {
    return (
      <div className="card">
        <h1 className="card-title">{this.props.title}</h1>
        <div className="card-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class ArticleCard extends Component<{
  article: ArticleBase,
}> {
  render() {
    return (
      <div className="card">
        <h1 className="card-title">{this.props.article.title}</h1>
      </div>
    );
  }
}

class ButtonPrimary extends Component<{
  onClick: () => mixed,
  children?: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-primary" onClick={this.props.onClick}>
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

class FormInput extends Component<{ type?: string, value: string, onChange: () => void}> {
  render() {
    return (
      <input type={this.props.type? this.props.type : 'text'} value={this.props.value} onChange={this.props.onChange}/>
    );
  }
}

export class FormGroup extends Component<{ children: React.Node }> {
  render() {
    return (
      <div className="form-group">
        {this.props.children}
      </div>
    );
  }
}

export class Form extends Component<{ children: React.Node }> {
  static Input = FormInput;
  static Group = FormGroup;

  render() {
    return (
      <form>
        {this.props.children}
      </form>
    );
  }
}
