// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import MarkdownRenderer from 'react-markdown-renderer';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import Form from '../../shared/Form';
import Icon from '../../shared/Icon';
import './CommentSection.css';
import { commentStore } from '../../../stores/commentStore';
import { userStore } from '../../../stores/userStore';
import Notifier from "../../shared/Notifier";

export default class CommentSection extends Component<{ articleID: number }> {
  comment: string = '';
  loading: boolean = false;
  pending: boolean = false;

  render() {
    return (
      <aside className="comments">
        <h2>Comments</h2>
        {this.loading ? (
          <em>Loading...</em>
        ) : commentStore.comments.length > 0 ? (
          commentStore.comments.map(c => (
            <div className="comment">
              <p>
                <em>
                  <span className="author">{this.getAuthor(c.authorID)}</span> said:
                </em>
              </p>
              <MarkdownRenderer markdown={c.text} />
            </div>
          ))
        ) : <em>No comments yet.</em>}
        <h2>Leave your own comment</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <SimpleMDE value={commentStore.draft.text} onChange={this.handleMarkdownChange} label="Comment:" options={{ spellChecker: false }} />
          </div>
          <Form.Submit disabled={this.pending || commentStore.draft.text === ''}><Icon.Upload /> Submit</Form.Submit>
        </form>
      </aside>
    );
  }

  handleMarkdownChange(value: string) {
    commentStore.draft.text = value;
  }

  getAuthor(id: number) {
    const user = userStore.cachedUsers.get(id);
    if (user) {
      return user.name;
    } else {
      return 'Unknown author';
    }
  }

  async mounted() {
    this.loading = true;
    commentStore.resetDraft(this.props.articleID);
    try {
      await commentStore.getComments(this.props.articleID);
      this.loading = false;
    } catch (e) {
      Notifier.error(`Could not fetch comments\n${e.message}`);
    }
  }

  async handleSubmit(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();

    if (commentStore.draft.text) {
      this.pending = true;
      try {
        await commentStore.addComment();
        Notifier.success('Uploaded comment!');
        await commentStore.getComments(this.props.articleID);
      } catch (e) {
        Notifier.error(`Could not upload comment\n${e.message}`);
      }
      this.pending = false;
    }
  }
}
