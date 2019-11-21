// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../shared/Cards';
import { articleStore } from '../../stores/articleStore';
import Notifier from '../shared/Notifier';

export default class FrontPage extends Component {
  render() {
    return (
      <main>
        <h1>Fridge News</h1>
        <CardHolder>
          {articleStore.articles.map(a => (
            <ArticleCard article={a} key={a.id} showCategory />
          ))}
        </CardHolder>
      </main>
    );
  }

  mounted(): void {
    articleStore.getFrontPage().catch((error: Error) => Notifier.error(`Could not fetch articles\n${error.message}`));
    document.title = 'Fridge News';
  }
}
