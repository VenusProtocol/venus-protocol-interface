import { ChainId } from 'types';

import { getSwapRouterContractAddress } from '..';
import { swapRouter } from '../../contractInfos';

const COMPTROLLER_ADDRESS = '0xb3BEf8955E047B734EBBe6903eD2e3C467cBC0bb';

describe('getSwapRouterContractAddress', () => {
  it('returns address when contract exists on chain', () => {
    const CHAIN_ID = 56;
    const address = getSwapRouterContractAddress({
      comptrollerAddress: COMPTROLLER_ADDRESS,
      chainId: CHAIN_ID,
    });

    expect(address).toBe(swapRouter.address[CHAIN_ID]?.[COMPTROLLER_ADDRESS.toLowerCase()]);
  });

  it('returns undefined when contract does not exist', () => {
    const address1 = getSwapRouterContractAddress({
      comptrollerAddress: 'fake-comptroller-address',
      chainId: 56,
    });

    expect(address1).toBe(undefined);

    const address2 = getSwapRouterContractAddress({
      comptrollerAddress: COMPTROLLER_ADDRESS,
      chainId: 1 as ChainId,
    });

    expect(address2).toBe(undefined);
  });
});
