// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Menu from './components/menu';
import { ArticleEditor, ArticleWriter } from './components/article/editor';
import ArticleViewer from './components/article/viewer';
import FrontPage from './components/front-page';
import CategoryPage from './components/category-page';
import Footer from './components/footer';
import './assets/css/globals.css';
import './assets/css/layout.css';
import ErrorPage from './components/error-page';
import { articleStore } from './stores/articleStore';
import NewsFeed from './components/news-feed';
import Notifier from './components/shared/Notifier';
import Login from './components/user/login';
import Register from './components/user/register';

// screw you, oppgavetekst
articleStore.getCategories().catch(e => Notifier.error(`Fatal error: Could not fetch categories!\n${e.message}`));

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <header id="masthead">
        <Menu />
        <Route exact path="/" component={NewsFeed} />
      </header>
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
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
