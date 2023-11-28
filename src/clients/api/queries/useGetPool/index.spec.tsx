import { waitFor } from '@testing-library/react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPools } from 'clients/api';

import useGetPool, { UseGetPoolOutput } from '.';

describe('api/queries/useGetPool', () => {
  beforeEach(() => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));
  });

  it('returns the correct asset', async () => {
    let data: Partial<UseGetPoolOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetPool({
        accountAddress: fakeAddress,
        poolComptrollerAddress: poolData[0].comptrollerAddress,
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });

  it('returns undefined when no matching pool is found', async () => {
    let data: Partial<UseGetPoolOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetPool({
        accountAddress: fakeAddress,
        poolComptrollerAddress: 'fake-comptroller-address',
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(data).toBe(undefined));
  });
});
