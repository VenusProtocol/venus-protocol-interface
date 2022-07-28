import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { VBep20 } from 'types/contracts';

import getVTokenBalance from '.';

describe('api/queries/getVTokenBalance', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        balanceOf: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await getVTokenBalance({
        vTokenContract: fakeContract,
        accountAddress: fakeAddress,
      });

      throw new Error('getVTokenBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the balance on success', async () => {
    const fakeBalanceWei = '1000';

    const callMock = jest.fn(async () => fakeBalanceWei);
    const getBalanceOfMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        balanceOf: getBalanceOfMock,
      },
    } as unknown as VBep20;

    const response = await getVTokenBalance({
      vTokenContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getBalanceOfMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getBalanceOfMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      balanceWei: new BigNumber(fakeBalanceWei),
    });
  });
});
