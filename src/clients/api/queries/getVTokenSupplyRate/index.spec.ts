import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

import getVTokenSupplyRate from '.';

const fakeAmountWei = new BigNumber('100');
const fakeReserveFactorMantissa = new BigNumber('10000000000000000');

describe('api/queries/getVTokenSupplyRate', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getSupplyRate: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as InterestModel;

    try {
      await getVTokenSupplyRate({
        interestModelContract: fakeContract,
        cashAmountWei: fakeAmountWei,
        borrowsAmountWei: fakeAmountWei,
        reservesAmountWei: fakeAmountWei,
        reserveFactorMantissa: fakeReserveFactorMantissa,
      });

      throw new Error('getVTokenSupplyRate should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the borrow rate of the interest model passed, in the correct format', async () => {
    const fakeSupplyRateWei = '1000000000000000000000000000';
    const callMock = jest.fn(async () => fakeSupplyRateWei);
    const getSupplyRateMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getSupplyRate: getSupplyRateMock,
      },
    } as unknown as InterestModel;

    const response = await getVTokenSupplyRate({
      interestModelContract: fakeContract,
      cashAmountWei: fakeAmountWei,
      borrowsAmountWei: fakeAmountWei,
      reservesAmountWei: fakeAmountWei,
      reserveFactorMantissa: fakeReserveFactorMantissa,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getSupplyRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      supplyRateWei: new BigNumber(fakeSupplyRateWei),
    });
  });
});
