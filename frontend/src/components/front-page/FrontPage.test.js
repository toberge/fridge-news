// @flow

import * as React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { shallow, ShallowWrapper } from 'enzyme/build';
import { articleStore } from '../../stores/articleStore';
import { ArticleBase } from '../../data/Article';
import FrontPage from './FrontPage';
import { ArticleCard } from '../shared/Cards';

jest.mock('../../stores/articleStore');
// mock this promise
const storeSpy = jest.spyOn(articleStore, 'getFrontPage').mockResolvedValue();

describe('ArticleViewer', () => {
  // set up data
  articleStore.articles = [
    new ArticleBase(1, 'whatever', '', '', 'science'),
    new ArticleBase(2, 'some stuff', 'https://totallyanimage.com/p.jpg', 'alt alt', 'culture')
  ];

  const frontPage: ShallowWrapper = shallow(<FrontPage />);

  it('should render article list as intended', () => {
    expect(frontPage.debug()).toMatchSnapshot();
    expect(frontPage.find(ArticleCard).first().props().article.title).toBe('whatever');
  });

  it('should make articleStore fetch articles', () => {
    expect(storeSpy).toHaveBeenCalled();
  })
});
