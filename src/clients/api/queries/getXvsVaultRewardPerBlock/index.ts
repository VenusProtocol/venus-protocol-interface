import BigNumber from 'bignumber.js';
import { XvsVault } from 'packages/contracts';

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
  const res = await xvsVaultContract.rewardTokenAmountsPerBlock(tokenAddress);

  return {
    rewardPerBlockWei: new BigNumber(res.toString()),
  };
};

export default getXvsVaultRewardPerBlock;
