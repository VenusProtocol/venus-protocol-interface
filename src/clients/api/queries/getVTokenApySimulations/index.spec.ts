import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

import getVTokenApySimulations from '.';

const fakeReserveFactorMantissa = new BigNumber(18);

describe('api/queries/getVTokenApySimulations', () => {
  test('throws an error when request fails', async () => {
    const fakeInterestModelContract = {
      methods: {
        getBorrowRate: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        getSupplyRate: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as InterestModel;

    try {
      await getVTokenApySimulations({
        interestModelContract: fakeInterestModelContract,
        reserveFactorMantissa: fakeReserveFactorMantissa,
      });

      throw new Error('getVTokenBorrowBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the APY simulations in the correct format on success', async () => {
    const fakeBorrowRate = '10000000000';
    const fakeSupplyRate = '20000000000';

    const getBorrowRateCallMock = jest.fn(async () => fakeBorrowRate);
    const getSupplyRateCallMock = jest.fn(async () => fakeSupplyRate);

    const fakeInterestModelContract = {
      methods: {
        getBorrowRate: () => ({
          call: getBorrowRateCallMock,
        }),
        getSupplyRate: () => ({
          call: getSupplyRateCallMock,
        }),
      },
    } as unknown as InterestModel;

    const response = await getVTokenApySimulations({
      interestModelContract: fakeInterestModelContract,
      reserveFactorMantissa: fakeReserveFactorMantissa,
    });

    expect(getBorrowRateCallMock).toHaveBeenCalledTimes(100);
    expect(getSupplyRateCallMock).toHaveBeenCalledTimes(100);
    expect(response).toMatchSnapshot();
  });
});
