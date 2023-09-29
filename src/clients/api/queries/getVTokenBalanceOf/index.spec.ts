import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { VToken as VTokenContract } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';

import getVTokenBalance from '.';

describe('api/queries/getVTokenBalance', () => {
  test('returns the balance on success', async () => {
    const fakeBalanceWei = BN.from('1000');

    const getBalanceOfMock = vi.fn(async () => fakeBalanceWei);

    const fakeContract = {
      balanceOf: getBalanceOfMock,
    } as unknown as VTokenContract;

    const response = await getVTokenBalance({
      vTokenContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getBalanceOfMock).toHaveBeenCalledTimes(1);
    expect(getBalanceOfMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      balanceWei: new BigNumber(fakeBalanceWei.toString()),
    });
  });
});
