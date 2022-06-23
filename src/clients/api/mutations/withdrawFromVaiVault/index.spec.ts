import BigNumber from 'bignumber.js';

import {
  VaiVaultErrorReporterError,
  VaiVaultErrorReporterInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import { VaiVault } from 'types/contracts';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import withdrawFromVaiVault from '.';

const fakeAmountWei = new BigNumber('1000000000000');
const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/mutation/withdrawFromVaiVault', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        withdraw: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiVault;

    try {
      await withdrawFromVaiVault({
        vaiVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        amountWei: fakeAmountWei,
      });

      throw new Error('withdrawFromVaiVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when failure event is present', async () => {
    const fakeContract = {
      methods: {
        withdraw: () => ({
          send: async () => ({
            events: {
              Failure: {
                returnValues: {
                  info: '1',
                  error: '1',
                },
              },
            },
          }),
        }),
      },
    } as unknown as VaiVault;

    try {
      await withdrawFromVaiVault({
        vaiVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        amountWei: fakeAmountWei,
      });

      throw new Error('stakeInVaiVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: ${VaiVaultErrorReporterError[1]}]`);
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(VaiVaultErrorReporterError[1]);
        expect(error.data.info).toBe(VaiVaultErrorReporterInfo[1]);
      }
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
    } as unknown as VaiVault;

    const response = await withdrawFromVaiVault({
      vaiVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(withdrawMock).toHaveBeenCalledTimes(1);
    expect(withdrawMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
