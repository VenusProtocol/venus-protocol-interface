import { renderComponent } from 'testUtils/render';

import LidoPool from '..';

describe('LidoPool', () => {
  it('renders without crashing', async () => {
    renderComponent(<LidoPool />);
  });
});
