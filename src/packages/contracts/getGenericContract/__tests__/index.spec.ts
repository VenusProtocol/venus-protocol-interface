import { ethers } from 'ethers';

import { getGenericContract } from '..';

const fakeProvider = new ethers.providers.JsonRpcProvider();

describe('getGenericContract', () => {
  it('returns Contract instance', () => {
    const fakeAddress = 'fake-address';
    const contract = getGenericContract({
      name: 'isolatedPoolComptroller',
      address: fakeAddress,
      signerOrProvider: fakeProvider,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract?.address).toBe(fakeAddress);
  });
});
