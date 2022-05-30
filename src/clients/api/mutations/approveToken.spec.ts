import transactionReceipt from '__mocks__/models/transactionReceipt';
import { Bep20 } from 'types/contracts';
import MAX_UINT256 from 'constants/maxUint256';
import approveToken from './approveToken';

const fakeAccountAddress = '0x3d7598124C212d2121234cd36aFe1c685FbEd848';
const fakeSpenderAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

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
    } as unknown as Bep20;

    try {
      await approveToken({
        tokenContract: fakeContract,
        accountAddress: fakeAccountAddress,
        spenderAddress: fakeSpenderAddress,
        allowance: MAX_UINT256.toFixed(),
      });

      throw new Error('approveToken should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Transaction Receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => transactionReceipt);
    const approveTokenMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        approve: approveTokenMock,
      },
    } as unknown as Bep20;

    const response = await approveToken({
      tokenContract: fakeContract,
      accountAddress: fakeAccountAddress,
      spenderAddress: fakeSpenderAddress,
      allowance: MAX_UINT256.toFixed(),
    });

    expect(response).toBe(transactionReceipt);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(fakeSpenderAddress, MAX_UINT256.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });
});
