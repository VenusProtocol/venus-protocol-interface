import { renderComponent } from 'testUtils/render';

import CorePool from '..';

describe('CorePool', () => {
  it('renders without crashing', async () => {
    renderComponent(<CorePool />);
  });
});
