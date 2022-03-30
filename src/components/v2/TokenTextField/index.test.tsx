import React from 'react';
import noop from 'noop-ts';

import renderComponent from 'testUtils/renderComponent';
import { TokenTextField } from '.';

describe('components/TokenTextField', () => {
  it('renders without crashing', async () => {
    renderComponent(<TokenTextField tokenSymbol="vai" onChange={noop} value="" />);
  });
});
