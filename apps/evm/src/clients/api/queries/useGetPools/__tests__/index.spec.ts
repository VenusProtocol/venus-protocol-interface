import { waitFor } from '@testing-library/dom';
import type Vi from 'vitest';

import { ChainId } from '@venusprotocol/registry';
import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import {
  getIsolatedPoolComptrollerContract,
  useGetLegacyPoolComptrollerContract,
  useGetPoolLensContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { restService } from 'utilities/restService';
import { useGetPools } from '..';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeIsolatedPoolParticipantsCount,
  fakeLegacyPoolComptrollerContract,
  fakePoolLensContract,
  fakeVaiControllerContract,
  fakeVenusLensContract,
} from '../__testUtils__/fakeData';

vi.mock('libs/contracts');
vi.mock('utilities/restService');

describe('useGetPools', () => {
  beforeEach(() => {
    (getIsolatedPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolComptrollerContract,
    );
    (useGetPoolLensContract as Vi.Mock).mockImplementation(() => fakePoolLensContract);
    (useGetLegacyPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeLegacyPoolComptrollerContract,
    );
    (useGetVenusLensContract as Vi.Mock).mockImplementation(() => fakeVenusLensContract);
    (useGetVaiControllerContract as Vi.Mock).mockImplementation(() => fakeVaiControllerContract);

    (restService as Vi.Mock).mockImplementation(async () => ({
      status: 200,
      data: apiPoolsResponse,
    }));

    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolParticipantsCount,
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.ARBITRUM_SEPOLIA,
    }));

    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });
});
