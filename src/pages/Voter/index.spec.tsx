import renderComponent from 'testUtils/renderComponent';

import Voter from '.';

describe('pages/Voter', () => {
  beforeAll(() => {
    jest.mock('clients/api');
  });

  it('renders without crashing', async () => {
    renderComponent(Voter);
  });
});
