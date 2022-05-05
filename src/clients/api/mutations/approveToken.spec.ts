import BigNumber from 'bignumber.js';
import transactionReceipt from '__mocks__/models/transactionReceipt';
import approveToken from './approveToken';

describe('api/mutations/approveToken', () => {
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
        accountAddress: '0x32asdf',
        allowance: new BigNumber(2).pow(256).minus(1).toString(10),
        vtokenAddress: '0x32asdf',
      });

      throw new Error('approveToken should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Transaction Receipt when request succeeds', async () => {
    const accountAddress = '0x3d7598124C212d2121234cd36aFe1c685FbEd848';
    const vtokenAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const allowance = new BigNumber(2).pow(256).minus(1).toString(10);

    const sendMock = jest.fn(async () => transactionReceipt);
    const approveTokenMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        approve: approveTokenMock,
      },
    } as unknown as any;

    const response = await approveToken({
      tokenContract: fakeContract,
      accountAddress,
      vtokenAddress,
      allowance,
    });

    expect(response).toBe(transactionReceipt);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(vtokenAddress, allowance);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: accountAddress });
  });
});
