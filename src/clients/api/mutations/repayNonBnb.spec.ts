import BigNumber from 'bignumber.js';

import { VBep20 } from 'types/contracts';
import repayNonBnb from './repayNonBnb';

describe('api/mutation/repayNonBnb', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        repayBorrow: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await repayNonBnb({
        vTokenContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repay should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const repayBorrowMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        repayBorrow: repayBorrowMock,
      },
    } as unknown as VBep20;

    const response = await repayNonBnb({
      vTokenContract: fakeContract,
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(undefined);
    expect(repayBorrowMock).toHaveBeenCalledTimes(1);
    expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
