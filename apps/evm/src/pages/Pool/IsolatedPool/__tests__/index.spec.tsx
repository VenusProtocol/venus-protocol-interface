import { renderComponent } from 'testUtils/render';

import IsolatedPool from '..';

describe('IsolatedPool', () => {
  it('renders without crashing', async () => {
    renderComponent(<IsolatedPool />);
  });
});
