import { ContractTypeByName } from 'packages/contracts';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAccountAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';

import getXvsVaultLockedDeposits from '.';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultLockedDeposits', () => {
  test('returns withdrawal requests on success', async () => {
    const getWithdrawalRequestsMock = vi.fn(async () => xvsVaultResponses.getWithdrawalRequests);

    const fakeContract = {
      getWithdrawalRequests: getWithdrawalRequestsMock,
    } as unknown as ContractTypeByName<'xvsVault'>;

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
