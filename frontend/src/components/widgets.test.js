// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import {ArticleCard} from './widgets';
import {ArticleBase} from "../utils/Article";
import { shallow, mount } from 'enzyme';

describe('Card', () => {
  const card = shallow(<ArticleCard article={new ArticleBase(1, 'There is food', '', '', 'culture')} />);

  it('has a title', done => {
    setTimeout(() => {
      const instance = ArticleCard.instance();
      expect(typeof instance).toEqual('object');
      // total bogus test
      if (instance) {
        expect(instance.props.article.title).toEqual('There is food');
        expect(typeof instance.props.article).toEqual('Article');
      }

      done();
    });
  })

});
