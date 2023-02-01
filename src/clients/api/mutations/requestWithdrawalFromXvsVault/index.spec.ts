import BigNumber from 'bignumber.js';
import { VError } from 'errors';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  VaiVaultErrorReporterError,
  VaiVaultErrorReporterInfo,
} from 'constants/contracts/errorReporter';
import { XvsVault } from 'types/contracts';

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
          call: async () => {},
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
          call: async () => {},
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
      expect(error).toMatchInlineSnapshot('[Error: UNAUTHORIZED]');
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(VaiVaultErrorReporterError[1]);
        expect(error.data.info).toBe(VaiVaultErrorReporterInfo[1]);
      }
    }
  });

  test('throws a specific error when static call fails due to user needing to complete withdrawal requests made before the XVSVault contract upgrade', async () => {
    const fakeContract = {
      methods: {
        requestWithdrawal: () => ({
          call: async () => {
            throw new Error(`Internal JSON-RPC error.
            {
              "code": 3,
              "message": "execution reverted: execute existing withdrawal before requesting new withdrawal",
            }`);
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
      expect(error).toMatchInlineSnapshot('[Error: UNAUTHORIZED]');
    }
  });

  test('returns receipt when request succeeds', async () => {
    const callMock = jest.fn(async () => fakeTransactionReceipt);
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const requestWithdrawalMock = jest.fn(() => ({
      call: callMock,
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
    expect(requestWithdrawalMock).toHaveBeenCalledTimes(2);
    expect(requestWithdrawalMock).toHaveBeenCalledWith(
      fakeRewardTokenAddress,
      fakePoolIndex,
      fakeAmountWei.toFixed(),
    );
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
