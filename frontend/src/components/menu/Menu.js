// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import NavBar from './NavBar';
import { capitalizeFirstLetter } from '../../data/Article';
import Icon from '../shared/Icon';
import logo from '../../assets/images/logo.svg';
import { articleStore } from '../../stores/articleStore';
import { userStore } from '../../stores/userStore';

export default class Menu extends Component {
  render() {
    return (
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
        {userStore.currentUser ? (
          <NavBar.Link to="/nahduh">
            <Icon.User /> {' ' + userStore.currentUser.name}
          </NavBar.Link>
        ) : (
          <NavBar.Link to="/login">
            <Icon.User /> Log In
          </NavBar.Link>
        )}
        {userStore.loggedIn ? (
          <NavBar.Link to="/articles/write">
            <Icon.Write /> Write
          </NavBar.Link>
        ) : null}
        <NavBar.Link to="/search">
          <Icon.Search /> Search
        </NavBar.Link>
      </NavBar>
    );
  }
}
