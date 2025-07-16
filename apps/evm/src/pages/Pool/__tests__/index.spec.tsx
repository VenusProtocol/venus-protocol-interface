import { renderComponent } from 'testUtils/render';

import Pool from '..';

describe('Pool', () => {
  it('renders without crashing', async () => {
    renderComponent(<Pool />);
  });
});
