import { waitFor } from '@testing-library/dom';
import type Vi from 'vitest';

import apiPoolsResponse from '__mocks__/api/pools.json';
import fakeAccountAddress from '__mocks__/models/address';
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

import { ChainId } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';
import { useGetPools } from '..';

vi.mock('libs/contracts');
vi.mock('utilities/restService');
// vi.mock('@venusprotocol/chains', () => ({
//   ...jest.requireActual('@venusprotocol/chains'),
//   chainMetadata: {
//     [ChainId.BSC_TESTNET]: {
//       corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
//     },
//   },
// }));

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
