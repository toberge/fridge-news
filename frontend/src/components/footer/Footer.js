// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import './Footer.css';
import Icon from '../shared/Icon';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <p>Copyright &copy; 2019 Fridge News</p>
        <p>
          <Icon.Email /> Send us a mail at{' '}
          <a href="mailto:fridge.news@gmail.com" target="_top">
            fridge.news@gmail.com
          </a>
        </p>
        <p>
          Current placeholder image is public domain and does not require contribution.
          <br />
          Regardless, I found it on <a href="https://www.pexels.com/photo/office-disk-storage-data-41290/">
            Pexels
          </a>{' '}
          and it seems to be from{' '}
          <a href="https://www.publicdomainpictures.net/en/view-image.php?image=14548">Public Domain Pictures</a>
        </p>
      </footer>
    );
  }
}
