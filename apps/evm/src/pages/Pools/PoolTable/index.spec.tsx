import { renderComponent } from 'testUtils/render';

import PoolTable from '.';

describe('PoolTable', () => {
  it('renders without crashing', () => {
    renderComponent(<PoolTable />);
  });
});
