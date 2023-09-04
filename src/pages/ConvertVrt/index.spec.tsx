import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import ConvertVrt from '.';

describe('pages/ConvertVRT', () => {
  it('renders without crashing', () => {
    renderComponent(<ConvertVrt />);
  });
});
