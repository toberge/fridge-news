// @flow

import * as React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import CommentSection from './CommentSection';
import Comment from '../../../data/Comment';
import { shallow, ShallowWrapper } from 'enzyme';
import { commentStore } from '../../../stores/commentStore';
import { userStore } from '../../../stores/userStore';
import User from '../../../data/User';

jest.mock('../../../stores/commentStore');

describe('CommentSection', () => {
  const commentSection: ShallowWrapper = shallow(<CommentSection articleID={1} />);

  it('should render no comments when none is present', () => {
    expect(commentSection.debug()).toMatchSnapshot();
  });

  it('should not be loading when getComments() is mocked', () => {
    expect(commentSection.instance().loading).toBe(false);
  });

  it('should fetch comments when mounting', () => {
    expect(commentStore.getComments).toHaveBeenCalled();
  });

  it('should list author as unknown if not found', () => {
    commentStore.comments.push(
      new Comment(1, 1, 'I hate this article', new Date(), null)
    );
    // supplying no user
    commentSection.update();
    commentSection.instance().forceUpdate();

    expect(commentSection.debug()).toMatchSnapshot();
  });

  it('should render comments when those are present', () => {
    commentStore.comments.push(
      new Comment(1, 1, "There, there... It'll be fine.", new Date(), null)
    );
    userStore.cachedUsers.set(1, new User(1, 'The Fridge', true));
    commentSection.update();
    commentSection.instance().forceUpdate();

    expect(commentSection.debug()).toMatchSnapshot();
  });



  it('should render form when user is logged in', () => {
    // log in
    userStore.currentUser = new User(1, 'The Fridge', true);
    commentSection.update();
    commentSection.instance().forceUpdate();

    expect(commentSection.debug()).toMatchSnapshot();
  });

  // it('should not upload w/o input', () => {
  it('should call handleSubmit() when submit is pressed', () => {
    // spy on dat method, mocking it to prevent the actual method from being called
    const submitSpy = jest.spyOn(commentSection.instance(), 'handleSubmit').mockImplementation(() => null);
    // log in
    userStore.currentUser = new User(1, 'The Fridge', true);
    commentSection.update();
    commentSection.instance().forceUpdate();

    //click and inspect
    expect(submitSpy).not.toHaveBeenCalled();
    commentSection.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });
});
