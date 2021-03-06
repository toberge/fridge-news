// @flow

import * as React from 'react';
import { Component } from 'react-simplified/lib/index';
import MarkdownRenderer from 'react-markdown-renderer';
import 'easymde/dist/easymde.min.css';
import { articleStore } from '../../../stores/articleStore';
import './ArticleViewer.css';
import Button from '../../shared/Button';
import { createHashHistory } from 'history';
import CommentSection from './comment-section';
import Notifier from '../../shared/Notifier';
import { userStore } from '../../../stores/userStore';
import Icon from '../../shared/Icon';
import { capitalizeFirstLetter } from '../../../data/Article';

const history = createHashHistory();

export default class ArticleViewer extends Component<{ match: { params: { id: number } } }> {
  hidden: boolean = true;

  render() {
    const {
      title,
      picturePath,
      pictureAlt,
      pictureCapt,
      text,
      uploadTime,
      updateTime
      // rating
    } = articleStore.currentArticle;
    return (
      <main>
        <div className={'wrapper' + (this.hidden || articleStore.loadingArticle ? ' hidden' : '')}>
          <article>
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
          </article>

          <aside className="details">
            <dl className="dateline">
              <dt>Author:</dt>
              <dd>{userStore.currentAuthor.name}</dd>
              <dt>Published:</dt>
              <dd>{uploadTime.toLocaleString()}</dd>
              {updateTime ? <dt>Updated:</dt> : null}
              {updateTime ? <dd>{updateTime.toLocaleString()}</dd> : null}
              {/*<dt>Rated:</dt>
              <dd>
                <meter value={rating} max={5} min={1} />
                {` (${rating} out of 5)`}
              </dd>*/}
            </dl>
          </aside>

          {userStore.currentUser &&
          userStore.currentAuthor &&
          (userStore.currentUser.admin || userStore.currentUser.id === userStore.currentAuthor.id) ? (
            <aside className="article-buttons">
              <strong>You may wish to </strong>
              <Button.Secondary onClick={this.handleEdit}>
                <Icon.Write /> Edit
              </Button.Secondary>
              <strong> or </strong>
              <Button.Danger onClick={this.handleDelete}>
                <Icon.Delete /> Delete
              </Button.Danger>
              <strong> this article.</strong>
            </aside>
          ) : null}

          <CommentSection articleID={this.props.match.params.id} />
        </div>
      </main>
    );
  }

  handleEdit() {
    if (articleStore.currentArticle.picturePath === null) {
      articleStore.currentArticle.picturePath = '';
      articleStore.currentArticle.pictureAlt = '';
      articleStore.currentArticle.pictureCapt = '';
    }
    history.push(`/articles/${this.props.match.params.id}/edit`);
  }

  handleDelete() {
    articleStore
      .deleteArticle()
      .then(() => {
        Notifier.success('Successfully deleted article');
        history.push('/'); // could handle other page, I guess
      })
      .catch((e: Error) => Notifier.error(`Could not delete article\n${e.message}`));
  }

  async mounted() {
    this.hidden = true;
    document.title = 'Loading... - Fridge News';
    try {
      await articleStore.getArticle(this.props.match.params.id);
      await userStore.getAuthor(articleStore.currentArticle.authorID);
      this.hidden = false;
      document.title = `${articleStore.currentArticle.title} - ${capitalizeFirstLetter(
        articleStore.currentArticle.category
      )} - Fridge News`;
    } catch (e) {
      Notifier.error(`Could not fetch article, reason:\n${e.message}`);
      history.push('/404');
    }
  }
}
