import enterMarkets from './enterMarkets';

describe('api/mutation/enterMarkets', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        enterMarkets: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await enterMarkets({
        comptrollerContract: fakeContract,
        account: '0x32asdf',
        vtokenAddresses: ['0x32asdf'],
      });

      throw new Error('enterMarkets should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const account = '0x3d7598124C212d2121234cd36aFe1c685FbEd848';
    const vtokenAddresses = ['0x3d759121234cd36F8124C21aFe1c6852d2bEd848'];

    const sendMock = jest.fn(async () => undefined);
    const enterMarketsMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        enterMarkets: enterMarketsMock,
      },
    } as unknown as any;

    const response = await enterMarkets({
      comptrollerContract: fakeContract,
      account,
      vtokenAddresses,
    });

    expect(response).toBe(undefined);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith(vtokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: account });
  });
});
