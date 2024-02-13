import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { XvsTokenMultichain } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';

import getXvsBridgeMintStatus from '.';

describe('getXvsBridgeMintStatus', () => {
  test('returns the mint status on success', async () => {
    const minterToCapMock = vi.fn(async () => BN.from('5000'));
    const minterToMintedAmountMock = vi.fn(async () => BN.from('1000'));

    const fakeContract = {
      minterToCap: minterToCapMock,
      minterToMintedAmount: minterToMintedAmountMock,
    } as unknown as XvsTokenMultichain;

    const response = await getXvsBridgeMintStatus({
      chainXvsProxyOftDestContractAddress: fakeAddress,
      xvsTokenMultichainContract: fakeContract,
    });

    expect(minterToCapMock).toHaveBeenCalledTimes(1);
    expect(minterToCapMock).toHaveBeenCalledWith(fakeAddress);
    expect(minterToMintedAmountMock).toHaveBeenCalledTimes(1);
    expect(minterToMintedAmountMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      minterToCapMantissa: new BigNumber('5000'),
      bridgeAmountMintedMantissa: new BigNumber('1000'),
    });
  });
});
