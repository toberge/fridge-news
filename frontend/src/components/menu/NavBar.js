// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import Icon from "../shared/Icon";
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';
import logo from "../../assets/images/logo.svg";

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
        <Link to="/" onClick={this.props.onClick}>
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
        <span>{this.props.children}</span>
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

  burton = React.createRef<HTMLButtonElement>();
  hidden: boolean = true;

  render() {
    return (
      <nav className="my-navbar">
        <button className="" aria-expanded="false" aria-controls="menu" onClick={this.handleExpand} ref={this.burton}>
          <Icon.Hamburger />
        </button>
        {/* Possibly style={{ 'visibility': this.hidden ? 'hidden' : 'visible' }} */}
        <ul id="menu" className="navbar-nav" hidden={this.hidden}>
          {this.props.children}
        </ul>
      </nav>
    );
  }

  handleExpand() {
    this.hidden = !this.hidden;
    if (this.burton.current) {
      this.burton.current.setAttribute(
        'aria-expanded',
        this.burton.current.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
      );
    }
  }
}
