import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import transactionReceipt from '__mocks__/models/transactionReceipt';
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
        fromAccountAddress: fakeAddress,
      });

      throw new Error('repay should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');

    const sendMock = jest.fn(async () => transactionReceipt);
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
      fromAccountAddress: fakeAddress,
    });

    expect(response).toBe(transactionReceipt);
    expect(repayBorrowMock).toHaveBeenCalledTimes(1);
    expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAddress });
  });
});
