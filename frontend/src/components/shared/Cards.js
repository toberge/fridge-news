// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { ArticleBase, capitalizeFirstLetter } from '../../data/Article';
import placeholderImage from '../../assets/images/floppy.jpg';
// Current placeholder is public domain and does not require contribution.
// Regardless, here's where I found it: https://www.pexels.com/photo/office-disk-storage-data-41290/
// and where it seems to be from: https://www.publicdomainpictures.net/en/view-image.php?image=1454

export class CardHolder extends Component<{ children: React.Node }> {
  render() {
    return <div className="card-columns">{this.props.children}</div>;
  }
}

export class ArticleCard extends Component<{
  article: ArticleBase,
  showCategory?: boolean
}> {
  render() {
    return (
      <NavLink className="card" style={{ width: '40rem;' }} to={`/articles/${this.props.article.id}`}>
        <img
          className="card-img-top"
          src={this.props.article.picturePath ? this.props.article.picturePath : placeholderImage}
          alt={this.props.article.pictureAlt ? this.props.article.pictureAlt : 'Floppy disks'}
        />
        <div className="card-body">
          <h2 className="card-title">{this.props.article.title}</h2>
        </div>
        {this.props.showCategory ? (
          <div className="card-footer text-muted">{capitalizeFirstLetter(this.props.article.category)}</div>
        ) : null}
      </NavLink>
    );
  }
}

export class NewsFeedCard extends Component<{
  article: ArticleBase
}> {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="card-text">
            <strong>
              <NavLink className="card" to={`/articles/${this.props.article.id}`}>
                {this.props.article.title}
              </NavLink>
            </strong>
          </div>
        </div>
      </div>
    );
  }
}
