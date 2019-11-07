// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import NavBar from './NavBar';
import { capitalizeFirstLetter } from '../../data/Article';
import Icon from '../shared/Icon';
import logo from '../../assets/images/logo.svg';
import { articleStore } from '../../stores/articleStore';

export default class Menu extends Component {
  render() {
    return (
      <header id="masthead">
        <NavBar>
          <NavBar.Brand>
            <img src={logo} alt="logo" /> Fridge News
          </NavBar.Brand>
          {articleStore.categories.map((category: string) => (
            <NavBar.Link exact to={`/articles/categories/${category}`}>
              {capitalizeFirstLetter(category)}
            </NavBar.Link>
          ))}
          <NavBar.Separator />
          <NavBar.Link to="/login">
            {/*TODO*/}
            <Icon.User /> Log In
          </NavBar.Link>
          <NavBar.Link to="/articles/write">
            <Icon.Write /> Write
          </NavBar.Link>
          <NavBar.Link to="/search">
            <Icon.Search /> Search
          </NavBar.Link>
        </NavBar>
      </header>
    );
  }
}
