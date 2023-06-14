import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import getXvsVaultRewardPerBlock from '.';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultRewardPerBlock', () => {
  test('returns the reward per block in wei on success', async () => {
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
      rewardPerBlockWei: new BigNumber(fakeOutput.toString()),
    });
  });
});
