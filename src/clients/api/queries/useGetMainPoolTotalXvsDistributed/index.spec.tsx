import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { markets } from '__mocks__/models/markets';
import { getMainMarkets } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetMainPoolTotalXvsDistributed, { UseGetMainPoolTotalXvsDistributed } from '.';

jest.mock('clients/api');

describe('api/queries/useGetMainPoolTotalXvsDistributed', () => {
  beforeEach(() => {
    (getMainMarkets as jest.Mock).mockImplementation(() => ({ markets }));
  });

  it('calculates totals correctly', async () => {
    let data: UseGetMainPoolTotalXvsDistributed['data'] = {
      totalXvsDistributedWei: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetMainPoolTotalXvsDistributed());
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(data.totalXvsDistributedWei.toNumber() > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
