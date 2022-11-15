import renderComponent from 'testUtils/renderComponent';

import VoterDetails from '.';

describe('pages/VoterDetail', () => {
  beforeAll(() => {
    jest.mock('clients/api');
  });

  it('renders without crashing', async () => {
    renderComponent(VoterDetails);
  });
});
