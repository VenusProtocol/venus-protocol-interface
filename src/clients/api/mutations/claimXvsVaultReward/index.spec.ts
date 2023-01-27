import { checkForXvsVaultProxyTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import claimXvsVaultReward from '.';

jest.mock('errors/transactionErrors');

const fakeRewardToken = TOKENS.xvs;
const fakePoolIndex = 4;

describe('api/mutation/claimXvsVaultReward', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const depositMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      deposit: depositMock,
    } as unknown as XvsVault;

    const response = await claimXvsVaultReward({
      xvsVaultContract: fakeContract,
      rewardToken: fakeRewardToken,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(fakeRewardToken.address, fakePoolIndex, 0);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
