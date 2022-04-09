import exitMarket from './exitMarket';

describe('api/mutation/exitMarket', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        exitMarket: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await exitMarket({
        comptrollerContract: fakeContract,
        account: '0x32asdf',
        vtokenAddress: '0x32asdf',
      });

      throw new Error('exitMarket should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const account = '0x3d7598124C212d2121234cd36aFe1c685FbEd848';
    const vtokenAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const sendMock = jest.fn(async () => undefined);
    const exitMarketMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        exitMarket: exitMarketMock,
      },
    } as unknown as any;

    const response = await exitMarket({
      comptrollerContract: fakeContract,
      account,
      vtokenAddress,
    });

    expect(response).toBe(undefined);
    expect(exitMarketMock).toHaveBeenCalledTimes(1);
    expect(exitMarketMock).toHaveBeenCalledWith(vtokenAddress);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: account });
  });
});
