// @flow

import * as React from 'react';
import Footer from './Footer';
import { shallow, mount, ShallowWrapper, render } from 'enzyme';

describe('Footer', () => {
  const footer: ShallowWrapper = shallow(<Footer />);

  it('should render as intended', () => {
    // basically testing how snapshots are written
    expect(footer.debug()).toMatchSnapshot();
  });
});
