// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import {ArticleCard, Card} from './widgets';
import { shallow, mount } from 'enzyme';

describe('Card', () => {
  const card = shallow(<Card title="hi there">how you doing</Card>);

  it('has a title', done => {
    setTimeout(() => {
      const instance = Card.instance();
      expect(typeof instance).toEqual('object');
      // total bogus test
      if (instance) expect(instance.props.title).toEqual('hi there');

      done();
    });
  })

});
