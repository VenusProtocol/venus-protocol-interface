import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import stakeInVrtVault from './stakeInVrtVault';

const fakeAmountWei = new BigNumber('1000000000000');
const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/mutation/stakeInVrtVault', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        deposit: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtVault;

    try {
      await stakeInVrtVault({
        vrtVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        amountWei: fakeAmountWei,
      });

      throw new Error('stakeInVrtVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const depositMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        deposit: depositMock,
      },
    } as unknown as VrtVault;

    const response = await stakeInVrtVault({
      vrtVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
