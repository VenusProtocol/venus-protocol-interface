import { renderComponent } from 'testUtils/render';

import PrimeSimulator from '..';

describe('PrimeSimulator', () => {
  it('renders without crashing', async () => {
    renderComponent(<PrimeSimulator />);
  });
});
