import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getVaiCalculateRepayAmount from '.';

describe('api/queries/getVaiCalculateRepayAmount', () => {
  test('throws an error when request fails', async () => {
    const fakeMulticall = {
      call: async () => {
        throw new Error('Fake error message');
      },
    } as unknown as Multicall;

    try {
      await getVaiCalculateRepayAmount({
        multicall: fakeMulticall,
        accountAddress: fakeAddress,
        repayAmountWei: new BigNumber('0'),
      });

      throw new Error('getVaiCalculateRepayAmount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI fee', async () => {
    const fakeMulticall = {
      call: jest.fn(async () => fakeMulticallResponses.vaiController.getVaiRepayInterests),
    } as unknown as Multicall;

    const response = await getVaiCalculateRepayAmount({
      multicall: fakeMulticall,
      accountAddress: fakeAddress,
      repayAmountWei: new BigNumber('100'),
    });

    expect(fakeMulticall.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall.call as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(response).toMatchSnapshot();
  });
});
