import { createMemoryHistory } from 'history';
import React from 'react';

import { routes } from 'constants/routing';
import renderComponent from 'testUtils/renderComponent';

import { CorePool, IsolatedPool } from '.';

const fakePoolId = 'fake-pool-id';

describe('pages/Pool', () => {
  describe('CorePool', () => {
    it('renders without crashing', async () => {
      const fakeHistory = createMemoryHistory();

      renderComponent(
        <CorePool
          history={fakeHistory}
          location="/"
          match={{
            params: {},
            isExact: true,
            path: routes.corePool.path,
            url: '',
          }}
        />,
      );
    });
  });

  describe('IsolatedPool', () => {
    it('renders without crashing', async () => {
      const fakeHistory = createMemoryHistory();

      renderComponent(
        <IsolatedPool
          history={fakeHistory}
          location="/"
          match={{
            params: {
              poolComptrollerAddress: fakePoolId,
            },
            isExact: true,
            path: routes.isolatedPool.path,
            url: '',
          }}
        />,
      );
    });
  });
});
