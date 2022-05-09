import BigNumber from 'bignumber.js';

import { VBep20 } from 'types/contracts';
import redeem from './redeem';

const fakeAmount = new BigNumber(10000000000000000);

describe('api/mutation/redeem', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        redeem: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await redeem({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('redeem should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const redeemMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        redeem: redeemMock,
      },
    } as unknown as VBep20;

    const response = await redeem({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeFromAccountsAddress,
    });

    expect(response).toBe(undefined);
    expect(redeemMock).toHaveBeenCalledTimes(1);
    expect(redeemMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
