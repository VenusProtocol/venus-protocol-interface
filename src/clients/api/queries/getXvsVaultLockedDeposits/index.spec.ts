import { XvsVault } from 'packages/contracts';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';

import getXvsVaultLockedDeposits from '.';

const xvsTokenAddress = xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultLockedDeposits', () => {
  test('returns withdrawal requests on success', async () => {
    const getWithdrawalRequestsMock = vi.fn(async () => xvsVaultResponses.getWithdrawalRequests);

    const fakeContract = {
      getWithdrawalRequests: getWithdrawalRequestsMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultLockedDeposits({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(getWithdrawalRequestsMock).toHaveBeenCalledTimes(1);
    expect(getWithdrawalRequestsMock).toHaveBeenCalledWith(
      xvsTokenAddress,
      fakePid,
      fakeAccountAddress,
    );
    expect(response).toMatchSnapshot();
  });
});
