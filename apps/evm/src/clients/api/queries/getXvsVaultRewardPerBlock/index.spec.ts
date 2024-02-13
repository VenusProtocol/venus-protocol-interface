import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { XvsVault } from 'libs/contracts';

import { xvs } from '__mocks__/models/tokens';

import getXvsVaultRewardPerBlock from '.';

const xvsTokenAddress = xvs.address;

describe('api/queries/getXvsVaultRewardPerBlock', () => {
  test('returns the reward per block in mantissa on success', async () => {
    const fakeOutput = BN.from('2000000000000000000');

    const rewardTokenAmountsPerBlockMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      rewardTokenAmountsPerBlock: rewardTokenAmountsPerBlockMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultRewardPerBlock({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
    });

    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toEqual({
      rewardPerBlockMantissa: new BigNumber(fakeOutput.toString()),
    });
  });
});
