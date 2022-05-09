import BigNumber from 'bignumber.js';

import { VBep20 } from 'types/contracts';
import supply from './supplyNonBnb';

const fakeAmount = new BigNumber(1000000000000);

describe('api/mutation/supplyNonBnb', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        mint: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await supply({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeAccount = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const supplyMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        mint: supplyMock,
      },
    } as unknown as VBep20;

    const response = await supply({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeAccount,
    });

    expect(response).toBe(undefined);
    expect(supplyMock).toHaveBeenCalledTimes(1);
    expect(supplyMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccount });
  });
});
