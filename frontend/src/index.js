// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import Menu from './components/Menu';
import ArticleEditor from './components/ArticleEditor';
import ArticleViewer from './components/ArticleViewer';
import FrontPage from './components/FrontPage';
import CategoryPage from './components/CategoryPage';
import Footer from './components/Footer';

class Error404 extends Component {
  render() {
    return (
      <main>
        <h1>404 error</h1>
      </main>
    );
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <Menu />
      <Route exact path="/" component={FrontPage} />
      <Route exact path="/articles/write" component={ArticleEditor} />
      <Route exact path="/articles/:id(\d+)" component={ArticleViewer} />
      <Route exact path="/articles/categories/:id([a-z]+)" component={CategoryPage} />
      {/*<Route component={Error404}/>*/}
      <Footer />
    </HashRouter>,
    root
  );
