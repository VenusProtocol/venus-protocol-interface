import { BigNumber as BN } from 'ethers';

import { xvs } from '__mocks__/models/tokens';

import type { XvsVault } from 'libs/contracts';

import { getXvsVaultsTotalDailyDistributedXvs } from '.';

const xvsTokenAddress = xvs.address;
const fakeOutput = BN.from('2000000000000000000');

describe('getXvsVaultsTotalDailyDistributedXvs', () => {
  it('returns the correct daily distributed XVS of a block based XVS vault contract', async () => {
    const rewardTokenAmountsPerBlockOrSecondMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      rewardTokenAmountsPerBlockOrSecond: rewardTokenAmountsPerBlockOrSecondMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultsTotalDailyDistributedXvs({
      xvsVaultContract: fakeContract,
      stakedToken: xvs,
      blocksPerDay: 28800,
    });

    expect(rewardTokenAmountsPerBlockOrSecondMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockOrSecondMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response.dailyDistributedXvs).toMatchInlineSnapshot('"57600"');
  });

  it('returns the correct daily distributed XVS of a time based XVS vault contract', async () => {
    const rewardTokenAmountsPerBlockOrSecondMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      rewardTokenAmountsPerBlockOrSecond: rewardTokenAmountsPerBlockOrSecondMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultsTotalDailyDistributedXvs({
      xvsVaultContract: fakeContract,
      stakedToken: xvs,
    });

    expect(rewardTokenAmountsPerBlockOrSecondMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockOrSecondMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response.dailyDistributedXvs).toMatchInlineSnapshot('"172800"');
  });
});
