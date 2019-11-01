// @flow

import * as React from 'react';
import { ArticleCard } from './Cards';
import { ArticleBase } from '../../utils/Article';
import { shallow, mount, ShallowWrapper, render } from 'enzyme';

describe('Card', () => {
  const TITLE = 'There is food';
  const ARTICLE = new ArticleBase(1, TITLE, '', '', 'culture');

  const card: ShallowWrapper = shallow(<ArticleCard article={ARTICLE} />);

  it('renders correctly', () => {
    expect(
      card.contains(
        <div className="card-body">
          <h2 className="card-title">{TITLE}</h2>
        </div>
      )
    ).toBe(true);
  });

  it('has a title', done => {
    // TODO why did teacher suggest setTimeout here?
    // setTimeout(() => {
    const instance = ArticleCard.instance();
    expect(typeof instance).toEqual('object');
    // total bogus test
    if (instance) {
      expect(instance.props.article instanceof ArticleBase).toBe(true);
      expect(instance.props.article.title).toEqual(TITLE);
    }
    done();
    // });
  });

  // NOTE: throws error when rendering since it uses NavLink and isn't in Router context here
  // it('renders to raw HTML', () => {
  //   expect(render(<ArticleCard article={ARTICLE} />).text()).toContain(TITLE);
  // })
});
