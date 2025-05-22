import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';
import { useGetVTreasuryContractAddress } from '../';

vi.mock('libs/contracts');

describe('useGetVTreasuryContractAddress', () => {
  it.each([ChainId.BSC_TESTNET, ChainId.BSC_MAINNET])(
    'calls the right getter function when current chain is BSC',
    chainId => {
      const { result } = renderHook(() => useGetVTreasuryContractAddress(), { chainId });

      expect(result.current).toMatchSnapshot();
    },
  );

  it('calls the right getter function when current chain is not BSC', () => {
    const { result } = renderHook(() => useGetVTreasuryContractAddress(), {
      chainId: ChainId.ETHEREUM,
    });

    expect(result.current).toMatchInlineSnapshot(`"0xfakeVTreasuryV8ContractAddress"`);
  });
});
