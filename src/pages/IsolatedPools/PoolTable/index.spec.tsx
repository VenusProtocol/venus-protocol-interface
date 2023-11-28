import { renderComponent } from 'testUtils/render';

import PoolTable from '.';

describe('pages/Pools/PoolTable', () => {
  it('renders without crashing', async () => {
    renderComponent(<PoolTable />);
  });
});
