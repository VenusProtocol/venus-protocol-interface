import { waitFor } from '@testing-library/dom';
import type { Mock } from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { type GetTokenBalancesInput, getTokenBalances } from 'clients/api/queries/getTokenBalances';
import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';
import {
  type UseGetContractAddressInput,
  useGetContractAddress,
} from 'hooks/useGetContractAddress';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { restService } from 'utilities/restService';
import { useGetPools } from '..';
import {
  fakeLegacyPoolComptrollerContractAddress,
  fakePoolLensContractAddress,
  fakePublicClient,
  fakeResilientOracleContractAddress,
  fakeVaiControllerContractAddress,
  fakeVenusLensContractAddress,
} from '../__testUtils__/fakeData';

vi.mock('utilities/restService');
vi.mock('clients/api/queries/getTokenBalances', () => ({
  getTokenBalances: vi.fn(),
}));
vi.mock('clients/api/queries/useGetIpLocation', () => ({
  useGetIpLocation: vi.fn(),
}));

const findAssetByVTokenSymbol = ({
  symbol,
  pools,
}: {
  symbol: string;
  pools?: {
    assets: {
      vToken: {
        symbol: string;
      };
      isRestricted: boolean;
      isGated: boolean;
    }[];
  }[];
}) => pools?.flatMap(pool => pool.assets).find(asset => asset.vToken.symbol === symbol);

describe('useGetPools', () => {
  beforeEach(() => {
    (useGetIpLocation as Mock).mockReturnValue({
      data: {
        countryCode: 'US',
      },
      error: null,
    });

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: fakePublicClient,
    }));

    (restService as Mock).mockImplementation(async () => ({
      status: 200,
      data: apiPoolsResponse,
    }));

    (useGetContractAddress as Mock).mockImplementation(({ name }: UseGetContractAddressInput) => {
      let address = '0xFakeContractAddress';

      if (name === 'PoolLens') {
        address = fakePoolLensContractAddress;
      }

      if (name === 'LegacyPoolComptroller') {
        address = fakeLegacyPoolComptrollerContractAddress;
      }

      if (name === 'VenusLens') {
        address = fakeVenusLensContractAddress;
      }

      if (name === 'VaiController') {
        address = fakeVaiControllerContractAddress;
      }

      if (name === 'ResilientOracle') {
        address = fakeResilientOracleContractAddress;
      }

      return {
        address,
      };
    });

    (getTokenBalances as Mock).mockImplementation(
      ({ publicClient: _1, accountAddress: _2, tokens }: GetTokenBalancesInput) => ({
        tokenBalances: tokens.map(token => ({
          token,
          balanceMantissa: new BigNumber('10000000000000000000'),
        })),
      }),
    );
  });

  it('returns pools in the correct format', async () => {
    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });

  it('returns pools with user data in the correct format', async () => {
    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });

  it('returns pools with time based reward rates in the correct format', async () => {
    const { result } = renderHook(() => useGetPools(), {
      chainId: ChainId.ARBITRUM_SEPOLIA,
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });

  it('marks restricted and gated assets based on the user country code', async () => {
    (useGetIpLocation as Mock).mockReturnValue({
      data: {
        countryCode: 'FR',
      },
      error: null,
    });

    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());

    const restrictedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vBNB',
    });
    const gatedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vUSDT',
    });

    expect(restrictedAsset?.isRestricted).toBe(true);
    expect(restrictedAsset?.isGated).toBe(false);
    expect(gatedAsset?.isRestricted).toBe(false);
    expect(gatedAsset?.isGated).toBe(true);
  });

  it('leaves restricted and gated flags disabled for allowed countries', async () => {
    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());

    const restrictedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vBNB',
    });
    const gatedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vUSDT',
    });

    expect(restrictedAsset?.isRestricted).toBe(false);
    expect(restrictedAsset?.isGated).toBe(false);
    expect(gatedAsset?.isRestricted).toBe(false);
    expect(gatedAsset?.isGated).toBe(false);
  });

  it('returns pools before country data is available and updates geo flags after rerender', async () => {
    (useGetIpLocation as Mock).mockReturnValue({
      data: undefined,
      error: null,
    });

    const { result, rerender } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());

    let restrictedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vBNB',
    });
    let gatedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vUSDT',
    });

    expect(restrictedAsset?.isRestricted).toBe(false);
    expect(gatedAsset?.isGated).toBe(false);

    (useGetIpLocation as Mock).mockReturnValue({
      data: {
        countryCode: 'FR',
      },
      error: null,
    });

    rerender();

    restrictedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vBNB',
    });
    gatedAsset = findAssetByVTokenSymbol({
      pools: result.current.data?.pools,
      symbol: 'vUSDT',
    });

    expect(restrictedAsset?.isRestricted).toBe(true);
    expect(gatedAsset?.isGated).toBe(true);
  });
});
