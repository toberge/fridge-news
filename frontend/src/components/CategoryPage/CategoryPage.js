// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../shared/Cards';
import { articleStore } from '../../stores/articleStore';
import { ArticleBase, capitalizeFirstLetter } from '../../data/Article';

export default class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    return (
      <main>
        <h1>{capitalizeFirstLetter(this.props.match.params.id)}</h1>
        {array && array.length > 0 ? (
          <CardHolder>{this.renderList(array)}</CardHolder>
        ) : (
          <h2>
            <em>We've come up empty</em>
          </h2>
        )}
      </main>
    );
  }

  // split into its own method because we need to check for undefined to pacify Flow
  renderList(array: ArticleBase[]): React.Node {
    if (array) return array.map(a => <ArticleCard article={a} key={a.id} />);
    else return 'No articles found';
  }

  mounted(): void {
    const category = this.props.match.params.id;
    articleStore.getCategory(category).catch(error => console.error(error));
    document.title = `Fridge News | ${capitalizeFirstLetter(category)}`;
  }
}
