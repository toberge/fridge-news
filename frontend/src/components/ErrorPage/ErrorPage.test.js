// @flow

import * as React from 'react';
import ErrorPage from './ErrorPage';
import { shallow, mount, ShallowWrapper, render } from 'enzyme';

describe('ErrorPage', () => {
  const footer: ShallowWrapper = shallow(<ErrorPage />);

  it('should render as intended', () => {
    expect(footer.debug()).toMatchSnapshot();
  });
});
