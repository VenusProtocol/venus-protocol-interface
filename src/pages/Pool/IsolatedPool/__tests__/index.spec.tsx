import { renderComponent } from 'testUtils/render';

import IsolatedPool from '..';

describe('pages/Pool/IsolatedPool', () => {
  it('renders without crashing', async () => {
    renderComponent(<IsolatedPool />);
  });
});
