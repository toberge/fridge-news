// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../widgets';
import { NavLink } from 'react-router-dom';
import { articleStore } from '../../stores/articleStore';

export default class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    return (
      <CardHolder>
        {this.renderList()}
      </CardHolder>
    );
  }

  // split into its own method because we need to check for undefined to pacify Flow
  renderList(): React.Node {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    if (array)
      return array.map(article => (
        <ArticleCard article={article}/>
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