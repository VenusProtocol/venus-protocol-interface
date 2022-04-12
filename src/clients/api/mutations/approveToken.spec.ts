import BigNumber from 'bignumber.js';
import approveToken from './approveToken';

describe('api/mutation/approveToken', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        approve: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await approveToken({
        tokenContract: fakeContract,
        account: '0x32asdf',
        allowance: new BigNumber(2).pow(256).minus(1).toString(10),
        vtokenAddress: '0x32asdf',
      });

      throw new Error('approveToken should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const account = '0x3d7598124C212d2121234cd36aFe1c685FbEd848';
    const vtokenAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const allowance = new BigNumber(2).pow(256).minus(1).toString(10);

    const sendMock = jest.fn(async () => undefined);
    const enterMarketsMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        approve: enterMarketsMock,
      },
    } as unknown as any;

    const response = await approveToken({
      tokenContract: fakeContract,
      account,
      vtokenAddress,
      allowance,
    });

    expect(response).toBe(undefined);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith(vtokenAddress, allowance);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: account });
  });
});
