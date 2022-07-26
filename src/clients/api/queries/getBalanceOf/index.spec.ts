import BigNumber from 'bignumber.js';

import { VrtToken } from 'types/contracts';

import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getBalanceOf', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        balanceOf: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtToken;

    try {
      await getBalanceOf({
        tokenContract: fakeContract,
        accountAddress: fakeAccountAddress,
      });

      throw new Error('getVrtBalanceOf should have thrown an error but did not');
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
    } as unknown as VrtToken;

    const response = await getBalanceOf({
      tokenContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(getBalanceOfMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getBalanceOfMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toEqual({
      balanceWei: new BigNumber(fakeBalanceWei),
    });
  });
});
