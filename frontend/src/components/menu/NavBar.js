// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';

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

class NavBarButton extends Component<{ onClick: () => mixed, children: React.Node }> {
  render() {
    return (
      <li>
        <Link to='/' onClick={this.props.onClick}>
          {this.props.children}
        </Link>
      </li>
    );
  }
}

class NavBarSeparator extends Component {
  render() {
    return <li className="separator"></li>;
  }
}

class NavBarFluff extends Component<{ children: React.Node }> {
  render() {
    return (
      <li>
        <span>
          {this.props.children}
        </span>
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

export default class NavBar extends Component<{ brand?: React.Node, children: React.Node }> {
  static Link = NavBarLink;
  static Brand = NavBarBrand;
  static Separator = NavBarSeparator;
  static Fluff = NavBarFluff;
  static Button = NavBarButton;

  render() {
    return (
      <nav className="my-navbar">
        <ul className="navbar-nav">{this.props.children}</ul>
      </nav>
    );
  }
}
