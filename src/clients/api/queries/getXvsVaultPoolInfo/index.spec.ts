import BigNumber from 'bignumber.js';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';

import { XvsVault } from 'packages/contracts';

import getXvsVaultPoolInfo from '.';

const fakeTokenAddress = '0x0';
const fakePid = 0;

describe('api/queries/getXvsVaultPoolInfo', () => {
  test('returns the pool infos on success', async () => {
    const poolInfosMock = vi.fn(async () => xvsVaultResponses.poolInfo);

    const fakeContract = {
      poolInfos: poolInfosMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultPoolInfo({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeTokenAddress,
      poolIndex: fakePid,
    });

    expect(poolInfosMock).toHaveBeenCalledTimes(1);
    expect(poolInfosMock).toHaveBeenCalledWith(fakeTokenAddress, fakePid);
    expect(response).toMatchSnapshot();
    expect(response.accRewardPerShare instanceof BigNumber).toBeTruthy();
  });
});
