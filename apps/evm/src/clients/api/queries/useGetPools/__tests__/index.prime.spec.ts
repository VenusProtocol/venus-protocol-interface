import { waitFor } from '@testing-library/dom';
import type { Mock } from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { type GetTokenBalancesInput, getTokenBalances } from 'clients/api/queries/getTokenBalances';
import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import {
  type UseGetContractAddressInput,
  useGetContractAddress,
} from 'hooks/useGetContractAddress';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { restService } from 'utilities/restService';
import type { ReadContractParameters } from 'viem';
import { useGetPools } from '..';
import {
  fakeLegacyPoolComptrollerContractAddress,
  fakePoolLensContractAddress,
  fakePrimeContractAddress,
  fakePrimeV2ContractAddress,
  fakePrimeV2LensContractAddress,
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

describe('useGetPools', () => {
  beforeEach(() => {
    (useGetIpLocation as Mock).mockReturnValue({
      data: {
        countryCode: 'US',
      },
      error: null,
    });

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: fakePublicClient,
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

      if (name === 'Prime') {
        address = fakePrimeContractAddress;
      }

      if (name === 'PrimeV2') {
        address = fakePrimeV2ContractAddress;
      }

      if (name === 'PrimeV2Lens') {
        address = fakePrimeV2LensContractAddress;
      }

      if (name === 'ResilientOracle') {
        address = fakeResilientOracleContractAddress;
      }

      return {
        address,
      };
    });

    (restService as Mock).mockImplementation(async () => ({
      status: 200,
      data: apiPoolsResponse,
    }));

    (getTokenBalances as Mock).mockImplementation(
      ({ publicClient: _1, accountAddress: _2, tokens }: GetTokenBalancesInput) => ({
        tokenBalances: tokens.map(token => ({
          token,
          balanceMantissa: new BigNumber('10000000000000000000'),
        })),
      }),
    );
  });

  it('fetches and formats Prime distributions and Prime distribution simulations if user is Prime', async () => {
    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });

  it('fetches Prime V2 distribution simulations if user is Prime', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime' || name === 'primeLeaderboard',
    );
    (restService as Mock).mockImplementation(async ({ endpoint }: { endpoint: string }) => {
      if (endpoint === '/prime/minimum-stake') {
        return {
          status: 200,
          data: {
            blockNumber: '123',
            computedAt: '2024-01-01T00:00:00.000Z',
            tokenLimit: 1000,
            totalTokens: 1000,
            mintThresholdMantissa: null,
            minimumStakeMantissa: '1000000000000000000000',
            reason: 'last_position',
          },
        };
      }

      return {
        status: 200,
        data: apiPoolsResponse,
      };
    });

    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    const assets = result.current.data?.pools.flatMap(pool => pool.assets) ?? [];
    const assetWithPrimeSimulation = assets.find(
      asset =>
        asset.supplyTokenDistributions.some(
          distribution => distribution.type === 'primeSimulation',
        ) ||
        asset.borrowTokenDistributions.some(
          distribution => distribution.type === 'primeSimulation',
        ),
    );

    expect(assetWithPrimeSimulation).toBeDefined();
  });

  it('does not fetch Prime distributions if user is not Prime', async () => {
    const customFakePublicClient = {
      ...fakePublicClient,
      readContract: vi.fn((input: ReadContractParameters) => {
        if (input.functionName === 'tokens' && input.address === fakePrimeContractAddress) {
          const isUserPrime = false;
          return [isUserPrime, false];
        }

        return fakePublicClient.readContract(input);
      }),
    };

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: customFakePublicClient,
    }));

    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toMatchSnapshot();
  });

  it('filters out Prime simulations that are 0', async () => {
    const customFakePublicClient = {
      ...fakePublicClient,
      readContract: vi.fn((input: ReadContractParameters) => {
        if (
          (input.functionName === 'estimateAPR' || input.functionName === 'calculateAPR') &&
          input.address === fakePrimeContractAddress
        ) {
          return {
            borrowAPR: 0n,
            supplyAPR: 0n,
          };
        }

        return fakePublicClient.readContract(input);
      }),
    };

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: customFakePublicClient,
    }));

    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toMatchSnapshot();
  });
});
