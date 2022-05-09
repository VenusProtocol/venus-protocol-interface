import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { VBep20 } from 'types/contracts';
import redeemUnderlying from './redeemUnderlying';

const fakeAmount = new BigNumber(10000000000000000);

describe('api/mutation/redeemUnderlying', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        redeemUnderlying: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await redeemUnderlying({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: fakeAccountAddress,
      });

      throw new Error('redeemUnderlying should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const sendMock = jest.fn(async () => undefined);
    const redeemUnderlyingMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        redeemUnderlying: redeemUnderlyingMock,
      },
    } as unknown as VBep20;

    const response = await redeemUnderlying({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeAccountAddress,
    });

    expect(response).toBe(undefined);
    expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });
});
