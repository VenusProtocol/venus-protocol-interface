import { waitFor } from '@testing-library/dom';
import { chains } from '@venusprotocol/chains';
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

describe('useGetPools collateral-gated campaigns', () => {
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


  it('derives the pool totals from the gated rate, not the campaign maximum', async () => {
    const corePool = apiPoolsResponse.result[0];
    const market = corePool.markets.find(m => m.underlyingSymbol === 'USDT')!;
    const merklDistributor = market.rewardsDistributors.find(r => r.rewardType === 'merkl')!;

    // A campaign the user cannot qualify for: they hold none of the participating collateral
    const gatedResponse = {
      ...apiPoolsResponse,
      result: apiPoolsResponse.result.map(pool =>
        pool !== corePool
          ? pool
          : {
              ...pool,
              markets: pool.markets.map(m =>
                m !== market
                  ? m
                  : {
                      ...m,
                      rewardsDistributors: m.rewardsDistributors.map(r =>
                        r !== merklDistributor
                          ? r
                          : {
                              ...r,
                              rewardTokenAddress: m.underlyingAddress,
                              rewardDetails: {
                                ...r.rewardDetails,
                                apr: 1000,
                                participatingCollateralAddresses: [
                                  '0x0000000000000000000000000000000000000001',
                                ],
                                eligibleBorrowMarketAddresses: [m.address],
                              },
                            },
                      ),
                    },
              ),
            },
      ),
    };

    (restService as Mock).mockImplementation(async () => ({ status: 200, data: gatedResponse }));

    const { result } = renderHook(() =>
      useGetPools({ accountAddress: fakeAccountAddress, includeIsolatedPools: true }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    const pool = result.current.data!.pools[0];
    const asset = pool.assets.find(a => a.vToken.underlyingToken.symbol === 'USDT')!;
    const merklDistribution = asset.borrowTokenDistributions.find(d => d.type === 'merkl');


    console.log('BORROW', asset.borrowTokenDistributions.map(d => `${d.type}:${d.apyPercentage.toFixed()}:${d.type === 'merkl' ? JSON.stringify(d.rewardDetails.aprPercentage) + ':' + JSON.stringify(!!d.collateralGate) : ''}`));
    console.log('COLLAT', asset.isCollateralOfUser, 'BORROWCENTS', asset.userBorrowBalanceCents.toFixed());

    // the campaign is advertised at its maximum
    expect(merklDistribution?.collateralGate?.isUserEligible).toBe(false);
    expect(merklDistribution?.collateralGate?.maxApyPercentage.toFixed()).toBe('1000');
    // but the user earns nothing from it, and the pool totals must agree
    expect(merklDistribution?.apyPercentage.toFixed()).toBe('0');

    const yearlyEarningsFromMax = asset.userBorrowBalanceCents.multipliedBy(10);
    expect(
      pool.userYearlyEarningsCents!.abs().isLessThan(yearlyEarningsFromMax.abs()),
    ).toBe(true);
  });
});
