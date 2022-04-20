import redeemUnderlying from './redeemUnderlying';

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
    } as any;

    try {
      await redeemUnderlying({
        tokenContract: fakeContract,
        amount: '10000000000000000',
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('redeemUnderlying should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeAmountWei = '10000000000000000';
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const redeemUnderlyingMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        redeemUnderlying: redeemUnderlyingMock,
      },
    } as unknown as any;

    const response = await redeemUnderlying({
      tokenContract: fakeContract,
      amount: fakeAmountWei,
      account: fakeFromAccountsAddress,
    });

    expect(response).toBe(undefined);
    expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmountWei);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
