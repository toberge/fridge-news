// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { ArticleBase, capitalizeFirstLetter } from '../utils/Article';
import placeholderImage from '../assets/images/floppy.jpg';
// Current placeholder is public domain and does not require contribution.
// Regardless, here's where I found it: https://www.pexels.com/photo/office-disk-storage-data-41290/
// and where it seems to be from: https://www.publicdomainpictures.net/en/view-image.php?image=14548

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

class NavBarSeparator extends Component {
  render() {
    return (
      <li className="separator"></li>
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
  static Separator = NavBarSeparator;

  render() {
    return (
      <nav className="my-navbar">
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

// TODO remove or refactor
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

export class CardHolder extends Component<{ children: React.Node }> {
  render() {
    return <div className="card-columns">{this.props.children}</div>;
  }
}

export class ArticleCard extends Component<{
  article: ArticleBase,
  showCategory?: boolean
}> {
  render() {
    return (
      <NavLink className="card" style={{ width: '40rem;' }} to={`/articles/${this.props.article.id}`}>
        <img
          className="card-img-top"
          src={this.props.article.picturePath ? this.props.article.picturePath : placeholderImage}
          alt={this.props.article.pictureAlt ? this.props.article.pictureAlt : 'Floppy disks'}
        />
        <div className="card-body">
          <h2 className="card-title">{this.props.article.title}</h2>
        </div>
        {this.props.showCategory ? (
          <div className="card-footer text-muted">{capitalizeFirstLetter(this.props.article.category)}</div>
        ) : null}
      </NavLink>
    );
  }
}

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
