import { waitFor } from '@testing-library/dom';
import { BigNumber as BN } from 'ethers';
import type Vi from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  type Prime,
  getIsolatedPoolComptrollerContract,
  useGetLegacyPoolComptrollerContract,
  useGetPoolLensContract,
  useGetPrimeContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import { restService } from 'utilities/restService';
import { useGetPools } from '..';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeIsolatedPoolParticipantsCount,
  fakeLegacyPoolComptrollerContract,
  fakePoolLensContract,
  fakePrimeContract,
  fakeVaiControllerContract,
  fakeVenusLensContract,
} from '../__testUtils__/fakeData';

vi.mock('libs/contracts');
vi.mock('utilities/restService');

describe('useGetPools', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );

    (getIsolatedPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolComptrollerContract,
    );
    (useGetPoolLensContract as Vi.Mock).mockImplementation(() => fakePoolLensContract);
    (useGetLegacyPoolComptrollerContract as Vi.Mock).mockImplementation(
      () => fakeLegacyPoolComptrollerContract,
    );
    (useGetVenusLensContract as Vi.Mock).mockImplementation(() => fakeVenusLensContract);
    (useGetVaiControllerContract as Vi.Mock).mockImplementation(() => fakeVaiControllerContract);
    (useGetPrimeContract as Vi.Mock).mockImplementation(() => fakePrimeContract);

    (restService as Vi.Mock).mockImplementation(async () => ({
      status: 200,
      data: apiPoolsResponse,
    }));

    (getIsolatedPoolParticipantsCount as Vi.Mock).mockImplementation(
      () => fakeIsolatedPoolParticipantsCount,
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

  it('does not fetch Prime distributions if user is not Prime', async () => {
    const customFakePrimeContract = {
      ...fakePrimeContract,
      tokens: async () => ({
        exists: false,
        isIrrevocable: false,
      }),
    } as unknown as Prime;
    (useGetPrimeContract as Vi.Mock).mockImplementation(() => customFakePrimeContract);

    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });

  it('filters out Prime simulations that are 0', async () => {
    const customFakePrimeContract = {
      ...fakePrimeContract,
      estimateAPR: async () => ({
        borrowAPR: BN.from(0),
        supplyAPR: BN.from(0),
      }),
      calculateAPR: async () => ({
        borrowAPR: BN.from(0),
        supplyAPR: BN.from(0),
      }),
    } as unknown as Prime;
    (useGetPrimeContract as Vi.Mock).mockImplementation(() => customFakePrimeContract);

    const { result } = renderHook(() =>
      useGetPools({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });
});
