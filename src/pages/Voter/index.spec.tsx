import renderComponent from 'testUtils/renderComponent';

import Voter from '.';

describe('pages/Voter', () => {
  beforeAll(() => {
    vi.mock('clients/api');
  });

  it('renders without crashing', async () => {
    renderComponent(Voter);
  });
});
