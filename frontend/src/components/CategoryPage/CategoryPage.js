// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../widgets';
import { articleStore } from '../../stores/articleStore';
import { ArticleBase, capitalizeFirstLetter } from '../../utils/Article';

export default class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    if (array && array.length > 0) {
      return (
        <main>
          <CardHolder>
            {this.renderList(array)}
          </CardHolder>
        </main>
      );
    } else {
      return (
        <main>
          <h1>Nothing here ¯\_(ツ)_/¯</h1>
        </main>
      )
    }
  }

  // split into its own method because we need to check for undefined to pacify Flow
  renderList(array: ArticleBase[]): React.Node {
    if (array)
      return array.map(a => (
        <ArticleCard article={a} key={a.id} />
      ));
    else return 'No articles found';
  }

  mounted(): void {
    const category = this.props.match.params.id;
    if (category) {
      articleStore
        .getCategory(category)
        .catch(error => console.error(error));
      document.title = `Fridge News | ${capitalizeFirstLetter(category)}`;
    } else {
      // TODO
    }
  }
}