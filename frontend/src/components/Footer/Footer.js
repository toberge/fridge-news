// @flow

import * as React from 'react';
import { Component } from 'react-simplified';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <p>Copyright &copy; 2019 Fridge News</p>
        <p>
          Logo credit: Icon made by <a href="https://www.freepik.com/home">Freepik</a> from{' '}
          <a href="http://www.flaticon.com/">www.flaticon.com</a>
        </p>
        <p>
          Current placeholder is public domain and does not require contribution.
          <br />
          Regardless, I found it on <a href="https://www.pexels.com/photo/office-disk-storage-data-41290/">
            Pexels
          </a>{' '}
          and it seems to be from{' '}
          <a href="https://www.publicdomainpictures.net/en/view-image.php?image=14548">Public Domain Pictures</a>
        </p>
        <ul>
          <li>
            <a href="mailto:contact@fridge.news" target="_top">
              Email
            </a>
          </li>
        </ul>
      </footer>
    );
  }
}
