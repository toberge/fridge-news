// @flow

import * as React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { shallow, ShallowWrapper, mount } from 'enzyme/build';
import ArticleViewer from './ArticleViewer';
import { articleStore } from '../../../stores/articleStore';
import { userStore } from '../../../stores/userStore';
import User from '../../../data/User';
import { Article } from '../../../data/Article';
import Button from '../../shared/Button';

jest.mock('../../../stores/articleStore');
jest.mock('history');

describe('ArticleViewer', () => {
  // set up data
  articleStore.currentArticle = new Article(
    1,
    2,
    'whatever',
    null,
    null,
    null,
    'blablabla',
    'science',
    new Date('1997-02-23T04:04:04'), // specific dat for snapshot integrity
    null,
    1,
    2.4
  );
  userStore.currentAuthor = new User(2, 'Author of Articles', false);
  userStore.cachedUsers.set(2, userStore.currentAuthor);

  const articleViewer: ShallowWrapper = shallow(<ArticleViewer match={{ params: { id: 1 } }} />);

  const update = () => {
    articleViewer.update();
    articleViewer.instance().forceUpdate();
  };

  it('should fetch article when mounting', () => {
    expect(articleStore.getArticle).toHaveBeenCalled();
  });

  it('should hide controls when user is NOT author of article', () => {
    userStore.currentUser = new User(42, 'white fish that does not write', false);
    update();
    expect(articleViewer.find('.article-buttons')).toHaveLength(0);
    expect(articleViewer.debug()).toMatchSnapshot();
  });

  it('should show controls when user is author of article', () => {
    userStore.currentUser = userStore.currentAuthor;
    update();
    expect(articleViewer.find('.article-buttons')).toHaveLength(1);
    expect(articleViewer.debug()).toMatchSnapshot();
  });

  it('should delete article when corresponding button is pressed', () => {
    userStore.currentUser = userStore.currentAuthor;
    const spy = jest.spyOn(articleStore, 'deleteArticle').mockResolvedValue();
    expect(spy).not.toHaveBeenCalled();
    // crappy way of calling onClick function since it's a child component
    // - since "mounted.find('button.btn-danger').simulate('click');" does not work
    articleViewer
      .find(Button.Danger)
      .props()
      .onClick();
    expect(spy).toHaveBeenCalled();
  });
});
