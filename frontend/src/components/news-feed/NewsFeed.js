// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Component } from 'react-simplified';
import { articleStore } from '../../stores/articleStore';
import './NewsFeed.css';
import Notifier from '../shared/Notifier';

// TODO stupid edgecase when writing article where entire array is shown duped...

export default class NewsFeed extends Component {
  interval: IntervalID = setInterval(this.poll, 5000);

  render() {
    return (
      <section id="news-feed">
        <ul>
          {articleStore.newsFeed.map(article => (
            <li key={article.id}>
              <Link to={`/articles/${article.id}`}>
                <strong>{article.title}</strong>
              </Link>
              <br />
              {/* really this much? */}
              {`${article.uploadTime.getDay()}/${article.uploadTime.getMonth()} ${article.uploadTime.toLocaleTimeString()}`}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  async mounted() {
    await this.poll();
  }

  async poll() {
    try {
      await articleStore.getNewsFeed();
    } catch (e) {
      Notifier.error(`Could not fetch news feed\n${e.message}`);
    }
  }

  beforeUnmount() {
    clearInterval(this.interval);
  }
}
