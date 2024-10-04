import type Vi from 'vitest';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { getVTreasuryContractAddress, getVTreasuryV8ContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';
import { useGetVTreasuryContractAddress } from '../';

vi.mock('libs/contracts');

describe('useGetVTreasuryContractAddress', () => {
  beforeEach(() => {
    (getVTreasuryContractAddress as Vi.Mock).mockImplementation(() => fakeAddress);

    (getVTreasuryV8ContractAddress as Vi.Mock).mockImplementation(() => altAddress);
  });

  it.each([ChainId.BSC_TESTNET, ChainId.BSC_MAINNET])(
    'calls the right getter function when current chain is BSC',
    chainId => {
      const { result } = renderHook(() => useGetVTreasuryContractAddress(), { chainId });

      expect(result.current).toEqual(fakeAddress);
    },
  );

  it('calls the right getter function when current chain is not BSC', () => {
    const { result } = renderHook(() => useGetVTreasuryContractAddress(), {
      chainId: ChainId.ETHEREUM,
    });

    expect(result.current).toEqual(altAddress);
  });
});
