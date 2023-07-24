import { ethers } from 'ethers';

import getContract from '..';
import * as contractInfos from '../../contractInfos';

const fakeProvider = new ethers.providers.JsonRpcProvider();

describe('getContract', () => {
  it('returns Contract instance of fixed address contract', () => {
    const contract = getContract('mainPoolComptroller', {
      signerOrProvider: fakeProvider,
      chainId: 56,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract!.address).toEqual(contractInfos.mainPoolComptroller.address![56]);
  });

  it('returns new Contract instance of generic contract', () => {
    const fakeAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const contract = getContract('isolatedPoolComptroller', {
      signerOrProvider: fakeProvider,
      address: fakeAddress,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract!.address).toEqual(fakeAddress);
  });
});
