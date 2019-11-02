// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import './ErrorPage.css';

export default class ErrorPage extends Component {
  render() {
    return (
      <main>
        <div className="center-wrapper">
          <div className="center-box">
            <h1>404 Not Found</h1>
            <p>- which means there's nothing here ¯\_(ツ)_/¯</p>
          </div>
        </div>
      </main>
    );
  }

}
