import { ethers } from 'ethers';

import { getUniqueContract } from '..';
import uniqueContractInfos from '../../contractInfos/uniqueContractInfos';
import { ChainId } from '../../types';

const fakeProvider = new ethers.providers.JsonRpcProvider();

describe('getUniqueContract', () => {
  it('returns Contract instance if contract exists', () => {
    const CHAIN_ID = 56;
    const contract = getUniqueContract({
      name: 'mainPoolComptroller',
      signerOrProvider: fakeProvider,
      chainId: CHAIN_ID,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract?.address).toBe(uniqueContractInfos.mainPoolComptroller.address[CHAIN_ID]);
  });

  it('returns undefined if contract does not exist', () => {
    const contract = getUniqueContract({
      name: 'mainPoolComptroller',
      signerOrProvider: fakeProvider,
      chainId: 1 as ChainId,
    });

    expect(contract).toBe(undefined);
  });
});
