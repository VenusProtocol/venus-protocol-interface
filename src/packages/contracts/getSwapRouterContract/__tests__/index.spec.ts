import { ethers } from 'ethers';

import { getSwapRouterContract } from '..';
import swapRouterContractInfos from '../../contractInfos/swapRouterContractInfos';
import { ChainId } from '../../types';

const fakeProvider = new ethers.providers.JsonRpcProvider();
const COMPTROLLER_ADDRESS = '0xb3BEf8955E047B734EBBe6903eD2e3C467cBC0bb';

describe('getSwapRouterContract', () => {
  it('returns Contract instance if contract exists', () => {
    const CHAIN_ID = 56;
    const contract = getSwapRouterContract({
      signerOrProvider: fakeProvider,
      comptrollerAddress: COMPTROLLER_ADDRESS,
      chainId: CHAIN_ID,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract?.address).toBe(
      swapRouterContractInfos.address[CHAIN_ID]?.[COMPTROLLER_ADDRESS.toLowerCase()],
    );
  });

  it('returns undefined when contract does not exist', () => {
    const contract1 = getSwapRouterContract({
      signerOrProvider: fakeProvider,
      comptrollerAddress: 'fake-comptroller-address',
      chainId: 56,
    });

    expect(contract1).toBe(undefined);

    const contract2 = getSwapRouterContract({
      signerOrProvider: fakeProvider,
      comptrollerAddress: COMPTROLLER_ADDRESS,
      chainId: 1 as ChainId,
    });

    expect(contract2).toBe(undefined);
  });
});
