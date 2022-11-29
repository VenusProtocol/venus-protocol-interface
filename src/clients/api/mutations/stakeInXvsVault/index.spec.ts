import BigNumber from 'bignumber.js';
import { VError } from 'errors';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  VaiVaultErrorReporterError,
  VaiVaultErrorReporterInfo,
} from 'constants/contracts/errorReporter';
import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import stakeInXvsVault from '.';

const fakeAmountWei = new BigNumber('1000000000000');
const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
const fakePoolIndex = 4;

describe('api/mutation/stakeInXvsVault', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        deposit: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await stakeInXvsVault({
        xvsVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        rewardToken: TOKENS.busd,
        amountWei: fakeAmountWei,
        poolIndex: fakePoolIndex,
      });

      throw new Error('stakeInXvsVault should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when failure event is present', async () => {
    const fakeContract = {
      methods: {
        deposit: () => ({
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
      await stakeInXvsVault({
        xvsVaultContract: fakeContract,
        fromAccountAddress: fakeFromAccountsAddress,
        rewardToken: TOKENS.busd,
        amountWei: fakeAmountWei,
        poolIndex: fakePoolIndex,
      });

      throw new Error('stakeInXvsVault should have thrown an error but did not');
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
    const depositMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        deposit: depositMock,
      },
    } as unknown as XvsVault;

    const response = await stakeInXvsVault({
      xvsVaultContract: fakeContract,
      fromAccountAddress: fakeFromAccountsAddress,
      rewardToken: TOKENS.busd,
      amountWei: fakeAmountWei,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(
      TOKENS.busd.address,
      fakePoolIndex,
      fakeAmountWei.toFixed(),
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
