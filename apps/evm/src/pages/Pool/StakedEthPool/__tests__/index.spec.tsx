import { renderComponent } from 'testUtils/render';

import StakedEthPool from '..';

describe('StakedEthPool', () => {
  it('renders without crashing', async () => {
    renderComponent(<StakedEthPool />);
  });
});
