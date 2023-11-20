import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetLegacyPool, useGetLegacyPoolTotalXvsDistributed } from 'clients/api';
import { renderComponent } from 'testUtils/render';

import Xvs from '.';

describe('pages/Xvs', () => {
  beforeEach(() => {
    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          userTotalBorrowLimitCents: new BigNumber('111'),
          userTotalBorrowBalanceCents: new BigNumber('91'),
          userTotalSupplyBalanceCents: new BigNumber('910'),
        },
      },
      isLoading: false,
    }));

    (useGetLegacyPoolTotalXvsDistributed as Vi.Mock).mockImplementation(() => ({
      data: {
        totalXvsDistributedMantissa: new BigNumber('91823912i376'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
