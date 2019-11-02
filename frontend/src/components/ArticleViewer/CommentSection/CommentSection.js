// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import MarkdownRenderer from 'react-markdown-renderer';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Button } from '../../widgets';

export default class CommentSection extends Component<{ articleID: number }> {
  comment: string = '';

  render() {
    return (
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
            <SimpleMDE onChange={this.handleMarkdownChange} label="Comment:" options={{ spellChecker: false }} />
          </div>
          <br />
          {/*<button id="comment-submit">Submit</button>*/}
          <Button.Primary onClick={() => null}>Submit</Button.Primary>
        </form>
      </section>
    );
  }

  handleMarkdownChange(value: string) {
    this.comment = value;
  }
}
