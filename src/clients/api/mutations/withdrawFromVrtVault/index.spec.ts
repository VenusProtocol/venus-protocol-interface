import { VrtVault } from 'types/contracts';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import withdrawFromVrtVault from '.';

const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/mutation/withdrawFromVrtVault', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        withdraw: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtVault;

    try {
      await withdrawFromVrtVault({
        vrtVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
      });

      throw new Error('withdrawFromVrtVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const withdrawMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        withdraw: withdrawMock,
      },
    } as unknown as VrtVault;

    const response = await withdrawFromVrtVault({
      vrtVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(withdrawMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
