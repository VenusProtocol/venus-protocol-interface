import renderComponent from 'testUtils/renderComponent';

import CorePool from '..';

describe('pages/Pool/CorePool', () => {
  it('renders without crashing', async () => {
    renderComponent(<CorePool />);
  });
});
