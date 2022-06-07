import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultRewardWeiPerBlockInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultRewardWeiPerBlockOutput = BigNumber;

const getXvsVaultRewardWeiPerBlock = async ({
  xvsVaultContract,
  tokenAddress,
}: IGetXvsVaultRewardWeiPerBlockInput): Promise<GetXvsVaultRewardWeiPerBlockOutput> => {
  const res = await xvsVaultContract.methods.rewardTokenAmountsPerBlock(tokenAddress).call();
  return new BigNumber(res);
};

export default getXvsVaultRewardWeiPerBlock;
