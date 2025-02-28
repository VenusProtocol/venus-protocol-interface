import { waitFor } from '@testing-library/dom';
import { ChainId } from '@venusprotocol/chains';
import type { Mock } from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import fakeBscCorePoolParticipantsCount from '__mocks__/subgraph/bscCorePoolParticipantsCount.json';
import fakeIsolatedPoolParticipantsCount from '__mocks__/subgraph/bscIsolatedPoolsParticipantsCount.json';
import BigNumber from 'bignumber.js';
import { type GetTokenBalancesInput, getTokenBalances, getUserVaiBorrowBalance } from 'clients/api';
import {
  getBscCorePoolParticipantsCount,
  getIsolatedPoolParticipantsCount,
} from 'clients/subgraph';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContractAddress,
  useGetVaiControllerContractAddress,
  useGetVenusLensContractAddress,
} from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
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
vi.mock('libs/contracts');
vi.mock('libs/wallet');

describe('useGetPools', () => {
  beforeEach(() => {
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: fakePublicClient,
    }));

    (useGetPoolLensContractAddress as Mock).mockImplementation(() => fakePoolLensContractAddress);
    (useGetLegacyPoolComptrollerContractAddress as Mock).mockImplementation(
      () => fakeLegacyPoolComptrollerContractAddress,
    );
    (useGetVenusLensContractAddress as Mock).mockImplementation(() => fakeVenusLensContractAddress);
    (useGetVaiControllerContractAddress as Mock).mockImplementation(
      () => fakeVaiControllerContractAddress,
    );

    (restService as Mock).mockImplementation(async () => ({
      status: 200,
      data: apiPoolsResponse,
    }));

    (getBscCorePoolParticipantsCount as Mock).mockImplementation(
      () => fakeBscCorePoolParticipantsCount,
    );

    (getIsolatedPoolParticipantsCount as Mock).mockImplementation(
      () => fakeIsolatedPoolParticipantsCount,
    );

    (getTokenBalances as Mock).mockImplementation(
      ({ publicClient: _1, accountAddress: _2, tokens }: GetTokenBalancesInput) => ({
        tokenBalances: tokens.map(token => ({
          token,
          balanceMantissa: new BigNumber('10000000000000000000'),
        })),
      }),
    );

    (getUserVaiBorrowBalance as Mock).mockImplementation(() => ({
      userVaiBorrowBalanceMantissa: new BigNumber('1000000000000000000'),
    }));
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
    (useChainId as Mock).mockImplementation(() => ({
      chainId: ChainId.ARBITRUM_SEPOLIA,
    }));

    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });
});
