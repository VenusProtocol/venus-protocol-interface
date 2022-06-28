import BigNumber from 'bignumber.js';

import {
  VaiVaultErrorReporterError,
  VaiVaultErrorReporterInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import { XvsVault } from 'types/contracts';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import requestWithdrawalFromXvsVault from '.';

const fakeAmountWei = new BigNumber('1000000000000');
const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('api/mutation/requestWithdrawalFromXvsVault', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        requestWithdrawal: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await requestWithdrawalFromXvsVault({
        xvsVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        rewardTokenAddress: fakeRewardTokenAddress,
        amountWei: fakeAmountWei,
        poolIndex: fakePoolIndex,
      });

      throw new Error('requestWithdrawalFromXvsVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when failure event is present', async () => {
    const fakeContract = {
      methods: {
        requestWithdrawal: () => ({
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
    } as unknown as XvsVault;

    try {
      await requestWithdrawalFromXvsVault({
        xvsVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        rewardTokenAddress: fakeRewardTokenAddress,
        amountWei: fakeAmountWei,
        poolIndex: fakePoolIndex,
      });

      throw new Error('requestWithdrawalFromXvsVault should have thrown an error but did not');
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
    const requestWithdrawalMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        requestWithdrawal: requestWithdrawalMock,
      },
    } as unknown as XvsVault;

    const response = await requestWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
      rewardTokenAddress: fakeRewardTokenAddress,
      amountWei: fakeAmountWei,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(requestWithdrawalMock).toHaveBeenCalledTimes(1);
    expect(requestWithdrawalMock).toHaveBeenCalledWith(
      fakeRewardTokenAddress,
      fakePoolIndex,
      fakeAmountWei.toFixed(),
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
