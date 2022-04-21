import supply from './supplyNonBnb';

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
    } as any;

    try {
      await supply({
        tokenContract: fakeContract,
        amount: '10000000000000000',
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeAmount = '1000000000000';
    const fakeAccount = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const supplyMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        mint: supplyMock,
      },
    } as unknown as any;

    const response = await supply({
      tokenContract: fakeContract,
      amount: fakeAmount,
      account: fakeAccount,
    });

    expect(response).toBe(undefined);
    expect(supplyMock).toHaveBeenCalledTimes(1);
    expect(supplyMock).toHaveBeenCalledWith(fakeAmount);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccount });
  });
});
