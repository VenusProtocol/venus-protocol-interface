import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPools } from 'clients/api';

import useGetAsset, { type UseGetAssetOutput } from '.';

describe('api/queries/useGetAsset', () => {
  beforeEach(() => {
    (useGetPools as Mock).mockImplementation(() => ({
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
        vTokenAddress: poolData[0].assets[0].vToken.address,
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
        vTokenAddress: '0xfakeVTokenAddress',
      }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
