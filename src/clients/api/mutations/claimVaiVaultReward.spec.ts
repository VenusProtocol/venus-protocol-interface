import { VaiVault } from 'types/contracts';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import claimVaiVaultReward from './claimVaiVaultReward';

const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/mutation/claimVaiVaultReward', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        claim: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiVault;

    try {
      await claimVaiVaultReward({
        vaiVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
      });

      throw new Error('claimVaiVaultReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const claimMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        claim: claimMock,
      },
    } as unknown as VaiVault;

    const response = await claimVaiVaultReward({
      vaiVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(claimMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
