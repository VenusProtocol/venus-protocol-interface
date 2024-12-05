import { waitFor } from '@testing-library/dom';
import type Vi from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import {
  getIsolatedPoolComptrollerContract,
  useGetLegacyPoolComptrollerContract,
  useGetPoolLensContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import { restService } from 'utilities/restService';
import {
  fakeIsolatedPoolComptrollerContract,
  fakeLegacyPoolComptrollerContract,
  fakePoolLensContract,
  fakeVaiControllerContract,
  fakeVenusLensContract,
} from '../__testUtils__/fakeData';

import { useGetPools } from '..';

vi.mock('hooks/useGetChainMetadata');
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

    (useGetChainMetadata as Vi.Mock).mockImplementation(() => ({
      blocksPerDay: 28800,
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
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => ({
      blocksPerDay: undefined,
    }));

    const { result } = renderHook(() => useGetPools());

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toMatchSnapshot();
  });
});
