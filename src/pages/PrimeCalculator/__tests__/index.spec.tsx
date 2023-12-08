import { renderComponent } from 'testUtils/render';

import PrimeCalculator from '..';

describe('PrimeCalculator', () => {
  it('renders without crashing', async () => {
    renderComponent(<PrimeCalculator />);
  });
});
