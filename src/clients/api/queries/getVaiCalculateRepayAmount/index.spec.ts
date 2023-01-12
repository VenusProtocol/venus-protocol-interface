import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { VaiController } from 'types/contracts';

import getVaiCalculateRepayAmount from '.';

describe('api/queries/getVaiTreasuryPercentage', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getVAICalculateRepayAmount: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiController;

    try {
      await getVaiCalculateRepayAmount({
        vaiControllerContract: fakeContract,
        accountAddress: fakeAddress,
        repayAmountWei: new BigNumber('0'),
      });

      throw new Error('getVaiCalculateRepayAmount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI fee', async () => {
    const fakeOutput = {
      0: '5',
      1: '1',
      2: '4',
    };
    const callMock = jest.fn(async () => fakeOutput);
    const vaiRepayAmountMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getVAICalculateRepayAmount: vaiRepayAmountMock,
      },
    } as unknown as VaiController;

    const response = await getVaiCalculateRepayAmount({
      vaiControllerContract: fakeContract,
      accountAddress: fakeAddress,
      repayAmountWei: new BigNumber('100'),
    });

    expect(vaiRepayAmountMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      vaiToBeBurned: new BigNumber(fakeOutput[0]),
      vaiCurrentInterest: new BigNumber(fakeOutput[1]),
      vaiPastInterest: new BigNumber(fakeOutput[2]),
      feePercentage: 5,
    });
  });
});
