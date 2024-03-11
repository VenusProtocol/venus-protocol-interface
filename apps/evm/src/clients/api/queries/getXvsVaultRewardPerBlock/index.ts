import BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';

export interface GetXvsVaultRewardPerBlockInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultRewardPerBlockOutput = {
  rewardPerBlockMantissa: BigNumber;
};

const getXvsVaultRewardPerBlock = async ({
  xvsVaultContract,
  tokenAddress,
}: GetXvsVaultRewardPerBlockInput): Promise<GetXvsVaultRewardPerBlockOutput> => {
  const res = await xvsVaultContract.rewardTokenAmountsPerBlock(tokenAddress);

  return {
    rewardPerBlockMantissa: new BigNumber(res.toString()),
  };
};

export default getXvsVaultRewardPerBlock;
