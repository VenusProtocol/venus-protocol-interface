import renderComponent from 'testUtils/renderComponent';

import Voter from '.';

describe('pages/Voter', () => {
  it('renders without crashing', async () => {
    renderComponent(<Voter />);
  });
});
