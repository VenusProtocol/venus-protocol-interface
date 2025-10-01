import { waitFor } from '@testing-library/dom';
import type { Mock } from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { type GetTokenBalancesInput, getTokenBalances } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

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
  fakeVaiControllerContractAddress,
  fakeVenusLensContractAddress,
} from '../__testUtils__/fakeData';

vi.mock('utilities/restService');

describe('useGetPools', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
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

  it('fetches and formats E-mode groups associated with each pool', async () => {
    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });
});
