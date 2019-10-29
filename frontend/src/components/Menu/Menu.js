// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavBar } from '../widgets';
import { CATEGORIES } from '../../utils/Article';

export default class Menu extends Component {
  render() {
    return (
      <NavBar>
        <NavBar.Brand>Fridge News</NavBar.Brand>
        {CATEGORIES.map((category: string) => (
          <NavBar.Link exact to={`/articles/categories/${category}`}>
            {category.charAt(0).toLocaleUpperCase() + category.substring(1, category.length)}
          </NavBar.Link>
        ))}
        <NavBar.Link to="/articles/write">
          <i className="fas fa-edit"></i> Write
        </NavBar.Link>
      </NavBar>
    );
  }
}

// TODO incorporate and remove
class OldMenu extends Component {
  render() {
    return (
      <header id="masthead">
        {' '}
        <nav className="navbar">
          <ul>
            <li>
              <a id="logo" href="index.html">
                Fridge News
              </a>
            </li>
            <li className="separator"></li>
            <li>
              <a href="#news"> News</a>
            </li>
            <li>
              <a href="#culture"> Culture</a>
            </li>
            <li>
              <a href="#science"> Science</a>
            </li>
            <li>
              <a href="#politics"> Politics</a>
            </li>
            <li className="separator"></li>
            <li>
              <a href="#">
                <i className="fas fa-search"></i> Search
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-edit"></i> Write
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-user"></i> Log In
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
