// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import ArticleEditor from './components/ArticleEditor';
import ArticleViewer from './components/ArticleViewer';
import { ArticleBase } from './utils/Article';
import { articleStore } from './services';

// REMOVE
import { NavLink } from 'react-router-dom';

import { ArticleCard, NavBar } from './components/widgets';

class OldMenu extends Component {
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

class Menu extends Component {
  render() {
    return (
      <NavBar>
        <NavBar.Brand>Fridge News</NavBar.Brand>
        <NavBar.Link exact to="/articles/categories/news">
          News
        </NavBar.Link>
        <NavBar.Link exact to="/articles/categories/culture">
          Culture
        </NavBar.Link>
        <NavBar.Link exact to="/articles/categories/science">
          Science
        </NavBar.Link>
        <NavBar.Link to="/articles/write">
          <i className="fas fa-edit"></i> Write
        </NavBar.Link>
      </NavBar>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <footer>
        <p>Copyright &copy; 2019 Fridge News</p>
        <p>
          Logo credit: Icon made by <a href="https://www.freepik.com/home">Freepik</a> from{' '}
          <a href="http://www.flaticon.com/">www.flaticon.com</a>
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
    return (
      <div className="card-columns">
        {articleStore.articles.map(a => (
          <ArticleCard article={a} />
        ))}
      </div>
    );
  }

  mounted(): void {
    articleStore.getFrontPage().catch(error => console.error(error));
  }
}

class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    return (
      <div>
        <ul>{this.renderList()}</ul>
      </div>
    );
  }

  // split into its own method because we need to check for undefined to pacify Flow
  renderList() {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    if (array)
      return array.map(a => (
        <li>
          <NavLink to={'/articles/' + a.id}>{a.title}</NavLink>
        </li>
      ));
    else return 'No articles found';
  }

  mounted(): void {
    articleStore
      .getCategory(this.props.match.params.id)
      // .then(e => super.forceUpdate(() => undefined))
      .catch(error => console.error(error));
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
      <Route exact path="/articles/categories/:id([a-z]+)" component={CategoryPage} />
      {/*<Route component={Error404}/>*/}
      <Footer />
    </HashRouter>,
    root
  );
