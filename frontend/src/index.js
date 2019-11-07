// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import { ArticleEditor, ArticleWriter } from './components/ArticleEditor';
import ArticleViewer from './components/ArticleViewer';
import FrontPage from './components/FrontPage';
import CategoryPage from './components/CategoryPage';
import Footer from './components/Footer';
import './assets/css/globals.css';
import './assets/css/layout.css';
import ErrorPage from './components/ErrorPage';
import { CATEGORIES } from './data/Article';
import {articleStore} from "./stores/articleStore";

// screw you, oppgavetekst
articleStore.getCategories();

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <Menu />
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route exact path="/articles/write" component={ArticleWriter} />
        <Route exact path="/articles/:id(\d+)" component={ArticleViewer} />
        <Route exact path="/articles/:id(\d+)/edit" component={ArticleEditor} />
        <Route
          exact
          // path={`/articles/categories/:id(${CATEGORIES.reduce((s, c) => `${s}|${c}`, '')})`}
          path="/articles/categories/:id([a-z]+)"
          component={CategoryPage}
        />
        {/* if none of these match, show our 404 page */}
        <Route component={ErrorPage} />
      </Switch>
      <Footer />
    </HashRouter>,
    root
  );
