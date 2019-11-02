// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../shared/Cards';
import { articleStore } from '../../stores/articleStore';
import { ArticleBase, capitalizeFirstLetter } from '../../utils/Article';
import ErrorPage from "../ErrorPage";

export default class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    if (array && array.length > 0) {
      return (
        <main>
          <h1>{capitalizeFirstLetter(this.props.match.params.id)}</h1>
          <CardHolder>
            {this.renderList(array)}
          </CardHolder>
        </main>
      );
    } else {
      return (
        <ErrorPage/>
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