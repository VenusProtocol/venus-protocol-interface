import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import fakeAddress from '__mocks__/models/address';

import { VBep20 } from 'packages/contracts';

import getVTokenBalance from '.';

describe('api/queries/getVTokenBalance', () => {
  test('returns the balance on success', async () => {
    const fakeBalanceMantissa = BN.from('1000');

    const getBalanceOfMock = vi.fn(async () => fakeBalanceMantissa);

    const fakeContract = {
      balanceOf: getBalanceOfMock,
    } as unknown as VBep20;

    const response = await getVTokenBalance({
      vTokenContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getBalanceOfMock).toHaveBeenCalledTimes(1);
    expect(getBalanceOfMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
    });
  });
});
