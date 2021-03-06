// @flow

import axios from 'axios';
import { sharedComponentData } from 'react-simplified';
import Comment from '../data/Comment';
import { userStore } from './userStore';

const empty = new Comment(-1, -1, 1, '', new Date(), null);

export class CommentStore {
  draft: Comment = empty;
  comments: Comment[] = [];

  /**
   * Fetches comments, filling userStore with authors if necessary.
   *
   * @param id
   * @returns {Promise<Comment[]>}
   */
  getComments(id: number): Promise<Comment[]> {
    return axios
      .get(`/articles/${id}/comments`)
      .then(response => {
        this.comments.splice(0, this.comments.length);
        this.comments.push(...this.toCommentArray(response.data));
      })
      .then(async data => {
        // fow complained about inside of forEach...
        // this.comments.forEach(c => (
        for (const c of this.comments) {
          await userStore.getUser(c.authorID);
        }
        // ));
        return data;
      });
  }

  resetDraft(id: number) {
    Object.assign(this.draft, { ...empty });
    this.draft.articleID = id;
  }

  addComment(): Promise<*> {
    if (!userStore.currentUser) return Promise.reject('Not logged in');
    return axios
      .post(
        `/articles/${this.draft.articleID}/comments`,
        {
          user_id: userStore.currentUser.id,
          content: this.draft.text
        },
        userStore.getTokenHeader()
      )
      .then(() => (this.draft.text = ''));
  }

  toCommentArray(result: []): Comment[] {
    return result.map(e => {
      const { comment_id, article_id, user_id, content, upload_time, update_time } = e;
      return new Comment(comment_id, article_id, user_id, content, upload_time, update_time);
    });
  }
}

export const commentStore = sharedComponentData(new CommentStore());
