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
    // clone a distributor the chain already knows, so the reward token resolves
    const template = market.rewardsDistributors.find(r => r.rewardType === 'venus')!;

    const gatedDistributor = {
      ...template,
      rewardType: 'merkl',
      supplySpeed: '0',
      borrowSpeed: '0',
      supplyApyRatio: '0',
      borrowApyRatio: '0',
      rewardDetails: {
        appName: 'Merkl',
        claimUrl: 'https://app.merkl.xyz/',
        merklCampaignId: 'campaign-id',
        merklCampaignIdentifier: '0xgated',
        description: 'Merkl campaign',
        tags: [],
        apr: 1000,
        tvlUsd: 1000,
        // the user holds none of this collateral, so they cannot qualify
        participatingCollateralAddresses: ['0x0000000000000000000000000000000000000001'],
        eligibleBorrowMarketAddresses: [market.address],
      },
    };

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
                  : { ...m, rewardsDistributors: [...m.rewardsDistributors, gatedDistributor] },
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
    const asset = pool.assets.find(a => a.vToken.address === market.address)!;
    const merklDistribution = asset.borrowTokenDistributions.find(d => d.type === 'merkl');

    // the campaign is advertised at its maximum
    expect(merklDistribution?.collateralGate?.isUserEligible).toBe(false);
    expect(merklDistribution?.collateralGate?.maxApyPercentage.toFixed()).toBe('1000');
    // but the user earns nothing from it
    expect(merklDistribution?.apyPercentage.toFixed()).toBe('0');

    // and the pool totals must agree: the campaign maximum alone would dwarf this
    const yearlyEarningsFromMax = asset.userBorrowBalanceCents.multipliedBy(10);
    expect(pool.userYearlyEarningsCents!.abs().isLessThan(yearlyEarningsFromMax.abs())).toBe(true);
  });
});
