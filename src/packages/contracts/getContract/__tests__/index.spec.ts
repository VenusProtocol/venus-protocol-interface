import { ethers } from 'ethers';

import getContract from '..';
import * as contractInfos from '../../contractInfos';

const fakeAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
const fakeProvider = new ethers.providers.JsonRpcProvider();

describe('getContract', () => {
  it('returns new Contract with address from contractInfos when chainId is provided', () => {
    const contract = getContract('mainPoolComptroller', {
      signerOrProvider: fakeProvider,
      chainId: 56,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract!.address).toEqual(contractInfos.mainPoolComptroller.address![56]);
  });

  it('returns new Contract with address from variables when address is provided', () => {
    const contract = getContract('mainPoolComptroller', {
      signerOrProvider: fakeProvider,
      address: fakeAddress,
    });

    expect(contract).toBeInstanceOf(ethers.Contract);
    expect(contract!.address).toEqual(fakeAddress);
  });

  it('returns undefined when neither address nor chainId could retrieve a valid address', () => {
    const contract = getContract('mainPoolComptroller', {
      signerOrProvider: fakeProvider,
      chainId: 9999,
    });

    expect(contract).toBeUndefined();
  });
});
