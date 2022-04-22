import BigNumber from 'bignumber.js';

import address from '__mocks__/models/address';
import { VTokenContract } from 'clients/contracts/types';
import borrowVToken from './borrowVToken';

describe('api/mutation/borrowVToken', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        borrow: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VTokenContract<'xvs'>;

    try {
      await borrowVToken({
        vTokenContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: address,
      });

      throw new Error('borrowVToken should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');

    const sendMock = jest.fn(async () => undefined);
    const borrowMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        borrow: borrowMock,
      },
    } as unknown as VTokenContract<'xvs'>;

    const response = await borrowVToken({
      vTokenContract: fakeContract,
      amountWei: fakeAmountWei,
      fromAccountAddress: address,
    });

    expect(response).toBe(undefined);
    expect(borrowMock).toHaveBeenCalledTimes(1);
    expect(borrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
