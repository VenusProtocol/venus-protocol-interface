import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import { markets } from '__mocks__/models/markets';
import { getMainMarkets } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetMainPoolTotalXvsDistributed, { UseGetMainPoolTotalXvsDistributedOutput } from '.';

describe('api/queries/useGetMainPoolTotalXvsDistributed', () => {
  beforeEach(() => {
    (getMainMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
  });

  it('returns data in the correct format', async () => {
    let data: UseGetMainPoolTotalXvsDistributedOutput['data'] = {
      totalXvsDistributedMantissa: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetMainPoolTotalXvsDistributed());
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(data && data.totalXvsDistributedMantissa.toNumber() > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
