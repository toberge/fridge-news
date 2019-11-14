// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ArticleCard, CardHolder } from '../shared/Cards';
import { articleStore } from '../../stores/articleStore';
import { capitalizeFirstLetter } from '../../data/Article';
import Notifier from "../shared/Notifier";

export default class CategoryPage extends Component<{ match: { params: { id: string } } }> {
  render() {
    const array = articleStore.categoryMap.get(this.props.match.params.id);
    return (
      <main>
        <h1>{capitalizeFirstLetter(this.props.match.params.id)}</h1>
        {array && array.length > 0 ? (
          <CardHolder>
            {array.map(a => (
              <ArticleCard article={a} key={a.id} />
            ))}
          </CardHolder>
        ) : (
          <h2>
            {/* TODO this is gonna appear evry single time before init, plz fix? */}
            <em>We've come up empty</em>
          </h2>
        )}
      </main>
    );
  }

  mounted(): void {
    const category = this.props.match.params.id;
    articleStore.getCategory(category).catch((error: Error) => Notifier.error(`Could not fetch categories\n${error.message}`));
    document.title = `${capitalizeFirstLetter(category)} - Fridge News`;
  }
}
