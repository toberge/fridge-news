// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import MarkdownRenderer from 'react-markdown-renderer';
import { Article } from './Article';
import { articleService } from './Services';

export class ArticleViewer extends Component<{ match: { params: { id: number } } }> {
  render() {
    const {
      title,
      ingress,
      picturePath,
      pictureAlt,
      pictureCapt,
      text,
      author,
      category,
      date,
      rating
    } = articleService.currentArticle;
    return (
      <article>
        <header>
          <h2>{title}</h2>
          <p className="ingress">
            <em>{ingress}</em>
          </p>
        </header>
        <figure>
          <img src={picturePath} alt={pictureAlt} />
          <figcaption>
            <p>
              <em>Image:</em>
              {' ' + pictureCapt}
            </p>
          </figcaption>
        </figure>
        <MarkdownRenderer markdown={text} />
        {/*comments TODO*/}
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
          <p>
            <label htmlFor="comment-text">Comment:</label>
            <br />
            <textarea
              id="comment-text"
              cols="80"
              rows="10"
              aria-label="Comment:"
            ></textarea>
            <br />
            <button id="comment-submit">Submit</button>
          </p>
        </section>
      </article>
    );
  }

  mounted(): void {
    articleService.getArticle();
  }
}
