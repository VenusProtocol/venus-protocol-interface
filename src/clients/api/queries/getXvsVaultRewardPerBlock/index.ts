import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface GetXvsVaultRewardPerBlockInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultRewardPerBlockOutput = {
  rewardPerBlockWei: BigNumber;
};

const getXvsVaultRewardPerBlock = async ({
  xvsVaultContract,
  tokenAddress,
}: GetXvsVaultRewardPerBlockInput): Promise<GetXvsVaultRewardPerBlockOutput> => {
  const res = await xvsVaultContract.methods.rewardTokenAmountsPerBlock(tokenAddress).call();

  return {
    rewardPerBlockWei: new BigNumber(res),
  };
};

export default getXvsVaultRewardPerBlock;
