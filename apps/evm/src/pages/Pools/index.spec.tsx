import { renderComponent } from 'testUtils/render';

import Pools from '.';

describe('Pools', () => {
  it('renders without crashing', async () => {
    renderComponent(<Pools />);
  });
});
