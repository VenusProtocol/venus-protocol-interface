import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import fakeAccountAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import getXvsVaultPendingReward from '.';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultPendingReward', () => {
  test('returns the pending reward of the user in wei on success', async () => {
    const fakeOutput = BN.from('2000000000000000000');

    const pendingRewardMock = jest.fn(async () => fakeOutput);

    const fakeContract = {
      pendingReward: pendingRewardMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultPendingReward({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(pendingRewardMock).toHaveBeenCalledTimes(1);
    expect(pendingRewardMock).toHaveBeenCalledWith(xvsTokenAddress, fakePid, fakeAccountAddress);
    expect(response).toEqual({
      pendingXvsReward: new BigNumber(fakeOutput.toString()),
    });
  });
});
