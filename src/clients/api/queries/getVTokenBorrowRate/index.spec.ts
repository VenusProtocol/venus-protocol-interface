import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

import getVTokenBorrowRate from '.';

const fakeAmountWei = new BigNumber('100');

describe('api/queries/getVTokenBorrowRate', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getBorrowRate: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as InterestModel;

    try {
      await getVTokenBorrowRate({
        interestModelContract: fakeContract,
        cashAmountWei: fakeAmountWei,
        borrowsAmountWei: fakeAmountWei,
        reservesAmountWei: fakeAmountWei,
      });

      throw new Error('getVTokenBorrowRate should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the borrow rate of the interest model passed, in the correct format', async () => {
    const fakeBorrowRateWei = new BigNumber('1000000000000000000000000000');
    const callMock = jest.fn(async () => fakeBorrowRateWei);
    const getBorrowRateMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getBorrowRate: getBorrowRateMock,
      },
    } as unknown as InterestModel;

    const response = await getVTokenBorrowRate({
      interestModelContract: fakeContract,
      cashAmountWei: fakeAmountWei,
      borrowsAmountWei: fakeAmountWei,
      reservesAmountWei: fakeAmountWei,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getBorrowRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      borrowRate: new BigNumber(fakeBorrowRateWei),
    });
  });
});
