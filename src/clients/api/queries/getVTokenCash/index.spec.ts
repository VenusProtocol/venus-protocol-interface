import BigNumber from 'bignumber.js';

import { VBep20 } from 'types/contracts';

import getVTokenCash from '.';

describe('api/queries/getVTokenCash', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getCash: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await getVTokenCash({
        vTokenContract: fakeContract,
      });

      throw new Error('getVTokenCash should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the cash value associated to the passed token, in the correct format', async () => {
    const fakeCashWei = '1000000000000000000000000000';
    const callMock = jest.fn(async () => fakeCashWei);
    const getCashMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getCash: getCashMock,
      },
    } as unknown as VBep20;

    const response = await getVTokenCash({
      vTokenContract: fakeContract,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getCashMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      cashWei: new BigNumber(fakeCashWei),
    });
  });
});
