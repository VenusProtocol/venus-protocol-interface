import { waitFor } from '@testing-library/react';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPools } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetAsset, { UseGetAssetOutput } from '.';

vi.mock('clients/api');

describe('api/queries/useGetAsset', () => {
  beforeEach(() => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));
  });

  it('returns the correct asset', async () => {
    let data: Partial<UseGetAssetOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetAsset({
        accountAddress: fakeAddress,
        vToken: poolData[0].assets[0].vToken,
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });

  it('returns undefined when no matching asset is found', async () => {
    let data: Partial<UseGetAssetOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetAsset({
        accountAddress: fakeAddress,
        vToken: {
          ...poolData[0].assets[0].vToken,
          address: 'fake-v-token-address',
        },
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
