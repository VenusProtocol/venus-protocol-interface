import { waitFor } from '@testing-library/react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetLegacyPool } from 'clients/api';

import useGetPools, { UseGetPoolsOutput } from '.';

describe('api/queries/useGetPools', () => {
  beforeEach(() => {
    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));
  });

  it('returns data in the correct format', async () => {
    let data: Partial<UseGetPoolsOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetPools({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
