// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../widgets';
import { articleStore } from '../../stores/articleStore';

export default class FrontPage extends Component {
  render() {
    return (
      <CardHolder>
        {articleStore.articles.map(a => (
          <ArticleCard article={a} />
        ))}
      </CardHolder>
    );
  }

  mounted(): void {
    articleStore.getFrontPage().catch(error => console.error(error));
  }
}
