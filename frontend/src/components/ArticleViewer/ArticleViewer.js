// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import MarkdownRenderer from 'react-markdown-renderer';
import 'easymde/dist/easymde.min.css';
import { articleStore } from '../../stores/articleStore';
import './ArticleViewer.css';
import { Button } from '../widgets';
import { createHashHistory } from 'history';
import CommentSection from './CommentSection';
import Notifier from '../shared/Notifier';
import { userStore } from '../../stores/userStore';
import Icon from '../shared/Icon';

const history = createHashHistory();

export default class ArticleViewer extends Component<{ match: { params: { id: number } } }> {
  hidden: boolean = true;

  render() {
    const {
      title,
      authorID,
      picturePath,
      pictureAlt,
      pictureCapt,
      text,
      uploadTime,
      rating
    } = articleStore.currentArticle;
    document.title = `Fridge News | ${title}`;
    return (
      <main className="mx-auto" style={{ width: '50em' }}>
        <article className={this.hidden || articleStore.loadingArticle ? 'hidden' : ''}>
          <header>
            <h1>{title}</h1>
          </header>
          {picturePath && pictureAlt && pictureCapt ? (
            <figure>
              <img src={picturePath} alt={pictureAlt} />
              <figcaption>
                <p>
                  <em>Image:</em>
                  {' ' + pictureCapt}
                </p>
              </figcaption>
            </figure>
          ) : null}
          <MarkdownRenderer markdown={text} />
          <section className="details">
            <dl className="dateline">
              <dt>Author:</dt>
              <dd>{userStore.currentAuthor.name}</dd>
              <dt>Published:</dt>
              <dd>{uploadTime.toLocaleString()}</dd>
              <dt>Rated:</dt>
              <dd>
                <meter value={rating} max={5} min={1} />
                {` (${rating} out of 5)`}
              </dd>
            </dl>
          </section>
          <section className="article-buttons">
            <strong>You may wish to </strong>
            <Button.Secondary onClick={() => history.push(`/articles/${this.props.match.params.id}/edit`)}>
              <Icon.Write /> Edit
            </Button.Secondary>
            <strong> or </strong>
            <Button.Danger onClick={() => null}>
              <Icon.Delete /> Delete
            </Button.Danger>
            <strong> this article.</strong>
          </section>
          <CommentSection articleID={this.props.match.params.id} />
        </article>
      </main>
    );
  }

  async mounted() {
    this.hidden = true;
    try {
      await articleStore.getArticle(this.props.match.params.id);
      await userStore.getAuthor(articleStore.currentArticle.authorID);
      this.hidden = false;
    } catch (e) {
      Notifier.error(`Could not fetch article, reason:\n${e.message}`);
      history.push('/404');
    }
  }
}
