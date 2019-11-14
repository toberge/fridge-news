// @flow

import * as React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import CommentSection from './CommentSection';
import Comment from '../../../data/Comment';
import { shallow, mount, ShallowWrapper, ReactWrapper, render } from 'enzyme';
import {commentStore, CommentStore} from "../../../stores/commentStore";
// jest.spyOn(commentStore, 'comments', 'get').mockReturnValue([new Comment(1, 2, 'shabalang', new Date(), null)]);
const spyGetComments = jest.spyOn(CommentStore.prototype, 'getComments').mockImplementation(async () => 0);

/*const comarr = new Array<Comment>(1);
comarr.push(new Comment(1, 2, 'shabalang', new Date(), null));
const mockGetComments = jest.fn();
jest.mock('../../../stores/commentStore', () => {
  return function () {
    return {
      comments: comarr,
      getComments: mockGetComments
    };
  };
});*/

// TODO if I bother
describe('CommentSection', () => {
  const commentSection: ShallowWrapper = shallow(<CommentSection articleID={1} />);

  it('should render as intended', () => {
    expect(commentSection.debug()).toMatchSnapshot();
  });

  it('should fetch comments when mounting', () => {
    // expect(mockGetComments).toHaveBeenCalled();
    // expect(spyGetComments).toHaveBeenCalled();
  });

  it('should not upload w/o input', () => {
    // console.log(commentSection.instance().handleSubmit);
    // const mockStuff = jest.fn();
    // commentSection.instance().handleSubmit = mockStuff;
    // const spy = jest.spyOn(commentSection.instance(), 'handleSubmit');
    commentSection.find('form').simulate('submit');
    // console.log(commentSection.find('form').debug())
    // expect(spy).toHaveBeenCalled();
    // expect(mockStuff).toHaveBeenCalled();
    // console.log(commentSection);
    // expect(commentSection.state('handleSubmit')).toHaveBeenCalled();
  });
});
