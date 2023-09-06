import { ethers } from 'ethers';
import { ChainId } from 'types';

import { getSwapRouterContract } from '..';
import swapRouterContractInfos from '../../contractInfos/swapRouterContractInfos';

const fakeProvider = new ethers.providers.JsonRpcProvider();
const COMPTROLLER_ADDRESS = '0xfD36E2c2a6789Db23113685031d7F16329158384';

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
