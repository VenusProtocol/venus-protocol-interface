import BigNumber from 'bignumber.js';

import repayVai from './repayVai';

describe('api/mutation/repayVai', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        repayVAI: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await repayVai({
        vaiControllerContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const repayVAIMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        repayVAI: repayVAIMock,
      },
    } as unknown as any;

    const response = await repayVai({
      vaiControllerContract: fakeContract,
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(undefined);
    expect(repayVAIMock).toHaveBeenCalledTimes(1);
    expect(repayVAIMock).toHaveBeenCalledWith(fakeAmountWei);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
