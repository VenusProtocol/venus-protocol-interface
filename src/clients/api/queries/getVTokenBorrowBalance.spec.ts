import BigNumber from 'bignumber.js';

import address from '__mocks__/models/address';
import { VBep20 } from 'types/contracts';
import getVTokenBorrowBalance from './getVTokenBorrowBalance';

describe('api/queries/getVTokenBorrowBalance', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        borrowBalanceCurrent: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await getVTokenBorrowBalance({
        vTokenContract: fakeContract,
        accountAddress: address,
      });

      throw new Error('getVTokenBorrowBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the XVS amount currently borrowed by the account provided, in the correct format', async () => {
    const fakeBorrowedTokens = new BigNumber('1000000000000000000000000000');
    const callMock = jest.fn(async () => fakeBorrowedTokens);
    const borrowBalanceCurrentMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        borrowBalanceCurrent: borrowBalanceCurrentMock,
      },
    } as unknown as VBep20;

    const response = await getVTokenBorrowBalance({
      vTokenContract: fakeContract,
      accountAddress: address,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(borrowBalanceCurrentMock).toHaveBeenCalledTimes(1);
    expect(borrowBalanceCurrentMock).toHaveBeenCalledWith(address);
    expect(response instanceof BigNumber).toBe(true);
    expect(response.toFixed()).toBe(fakeBorrowedTokens.toFixed());
  });
});
