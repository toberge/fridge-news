// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { ArticleBase } from '../utils/Article';

// TODO is this copied too heavily?
class NavBarLink extends Component<{ exact?: boolean, to: string, children: React.Node }> {
  render() {
    return (
      <li>
        <NavLink activeClassName="active" exact={this.props.exact} to={this.props.to}>
          {this.props.children}
        </NavLink>
      </li>
    );
  }
}

class NavBarBrand extends Component<{ children: React.Node }> {
  render() {
    return (
      <li>
        <NavLink id="logo" activeClassName="active" exact to="/">
          {this.props.children}
        </NavLink>
      </li>
    );
  }
}

export class NavBar extends Component<{ brand?: React.Node, children: React.Node }> {
  static Link = NavBarLink;
  static Brand = NavBarBrand;

  render() {
    return (
      <nav className="navbar">
        {' '}
        {/* navbar-expand-sm bg-light navbar-light*/}
        {/*<NavLink id="logo" className="navbar-brand" activeClassName="active" exact to="/">*/}
        {/*  Fridge News*/}
        {/*</NavLink>*/}
        <ul className="navbar-nav">{this.props.children}</ul>
      </nav>
    );
  }
}

export class Card extends Component<{
  title: string,
  children: React.ChildrenArray<React.Node>
}> {
  render() {
    return (
      <div className="card">
        <h1 className="card-title">{this.props.title}</h1>
        <div className="card-body">{this.props.children}</div>
      </div>
    );
  }
}

export class ArticleCard extends Component<{
  article: ArticleBase
}> {
  render() {
    return (
      <div className="card" style={{width: '30rem;'}}>
        <img
          className="card-img-top"
          src={this.props.article.picturePath ? this.props.article.picturePath : '#'}
          alt={this.props.article.pictureAlt ? this.props.article.pictureAlt : 'Missing Image'}
        />
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
