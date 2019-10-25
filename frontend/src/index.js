// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { ArticleEditor } from './ArticleEditor';
import { ArticleViewer } from './ArticleViewer';

class Menu extends Component {
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

class Footer extends Component {
  render() {
    return (
      <footer>
        <p>Copyright &copy; 2019 Fridge News</p>
        <p>
          Logo credit: Icon made by <a href="https://www.freepik.com/home">Freepik</a>{' '}
          from <a href="http://www.flaticon.com/">www.flaticon.com</a>
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

class FrontPage extends Component {
  render() {
    return <div>rougwrg</div>;
  }
}

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
      {/*<Route path="/articles" component={ArticlesSomething}/>*/}
      <Route exact path="/articles/write" component={ArticleEditor} />
      <Route exact path="/articles/:id(\d+)" component={ArticleViewer} />
      {/*<Route component={Error404}/>*/}
      <Footer />
    </HashRouter>,
    root
  );
