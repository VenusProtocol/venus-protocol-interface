import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAccountAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import getXvsVaultLockedDeposits from '.';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultLockedDeposits', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getWithdrawalRequests: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultLockedDeposits({
        xvsVaultContract: fakeContract,
        rewardTokenAddress: xvsTokenAddress,
        accountAddress: fakeAccountAddress,
        poolIndex: fakePid,
      });

      throw new Error('getXvsVaultLockedDeposits should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns withdrawal requests on success', async () => {
    const callMock = jest.fn(async () => xvsVaultResponses.getWithdrawalRequests);
    const getWithdrawalRequestsMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getWithdrawalRequests: getWithdrawalRequestsMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultLockedDeposits({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getWithdrawalRequestsMock).toHaveBeenCalledTimes(1);
    expect(getWithdrawalRequestsMock).toHaveBeenCalledWith(
      xvsTokenAddress,
      fakePid,
      fakeAccountAddress,
    );
    expect(response).toMatchSnapshot();
  });
});
