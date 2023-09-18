import BigNumber from 'bignumber.js';
import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { busd } from '__mocks__/models/tokens';

import stakeInXvsVault from '.';

vi.mock('errors/transactionErrors');

const fakeAmountWei = new BigNumber('1000000000000');
const fakePoolIndex = 4;

describe('api/mutation/stakeInXvsVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const depositMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      deposit: depositMock,
    } as unknown as ContractTypeByName<'xvsVault'>;

    const response = await stakeInXvsVault({
      xvsVaultContract: fakeContract,
      rewardToken: busd,
      amountWei: fakeAmountWei,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(busd.address, fakePoolIndex, fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
