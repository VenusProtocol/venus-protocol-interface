import { createMemoryHistory } from 'history';
import React from 'react';

import { routes } from 'constants/routing';
import renderComponent from 'testUtils/renderComponent';

import Pool from '.';

const fakePoolId = 'fake-pool-id';

describe('pages/Pool', () => {
  it('renders without crashing', async () => {
    const fakeHistory = createMemoryHistory();

    renderComponent(
      <Pool
        history={fakeHistory}
        location="/"
        match={{
          params: {
            poolComptrollerAddress: fakePoolId,
          },
          isExact: true,
          path: routes.pool.path,
          url: '',
        }}
      />,
    );
  });
});
