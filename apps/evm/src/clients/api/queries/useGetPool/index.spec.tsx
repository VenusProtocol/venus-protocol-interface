import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPools } from 'clients/api';

import useGetPool, { type UseGetPoolOutput } from '.';

describe('api/queries/useGetPool', () => {
  beforeEach(() => {
    (useGetPools as Mock).mockImplementation(() => ({
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
        poolComptrollerAddress: '0xFakeComptrollerAddress',
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(data).toBe(undefined));
  });
});
