// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import MarkdownRenderer from 'react-markdown-renderer';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Article } from '../../utils/Article';
import { articleStore } from '../../stores/articleStore';

export default class ArticleViewer extends Component<{ match: { params: { id: number } } }> {
  comment: string;

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
    return (
      <main className="mx-auto" style={{width: '50em'}}>
      <article>
        <header>
          <h1>{title}</h1>
        </header>
        { picturePath && pictureAlt && pictureCapt ?
          <figure>
            <img src={picturePath} alt={pictureAlt} />
            <figcaption>
              <p>
                <em>Image:</em>
                {' ' + pictureCapt}
              </p>
            </figcaption>
          </figure>
          : null
        }
        <MarkdownRenderer markdown={text} />
        {/*comments TODO*/}
        <section className="details">
          <dl className="dateline">
            <dt>Author:</dt>
            <dd>{authorID}</dd>
            <dt>Published:</dt>
            <dd>{uploadTime.toLocaleString()}</dd>
            <dt>Rated:</dt>
            <dd>
              <meter value={rating} max={5} min={1} />
              <br />
              {` (${rating} out of 5)`}
            </dd>
          </dl>
        </section>
        <section className="comments">
          <h2>Comments</h2>
          <div className="comment">
            <p>
              <em>
                <span className="author">Grumbling Grevory</span> said:
              </em>
            </p>
            <p>I really hate this article...</p>
          </div>
          <div className="comment">
            <p>
              <em>
                <span className="author">Somebody</span> said:
              </em>
            </p>
            <p>
              Everything is fine.
              <br />
              It really is.
            </p>
          </div>
          <h2>Leave your own comment</h2>
          <form>
            <div className="form-group">
            <SimpleMDE onChange={this.handleMarkdownChange} label="Comment:" options={{spellChecker: false}} />
            </div>
            <br />
            <button id="comment-submit">Submit</button>
          </form>
        </section>
      </article>
      </main>
    );
  }

  mounted(): void {
    articleStore.getArticle(this.props.match.params.id)
      .catch(e => console.error(e));
  }

  handleMarkdownChange(value: string) {
    this.comment = value;
  }
}
