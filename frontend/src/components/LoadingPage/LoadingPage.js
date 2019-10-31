// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import './LoadingPage.css';
import Icon from '../shared/Icon';


export default class LoadingPage extends Component {
  render() {
    return (
      <main>
        <div className="loading-wrapper">
          <div className="loading-box">
            <Icon.Loading />
            <h1>Loading...</h1>
          </div>
        </div>
      </main>
    );
  }

}
