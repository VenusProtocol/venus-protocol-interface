import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface GetXvsVaultPendingRewardWeiInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultPendingRewardWeiOutput = BigNumber;

const getXvsVaultPendingRewardWei = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultPendingRewardWeiInput): Promise<GetXvsVaultPendingRewardWeiOutput> => {
  const res = await xvsVaultContract.methods
    .pendingReward(rewardTokenAddress, poolIndex, accountAddress)
    .call();
  return new BigNumber(res);
};

export default getXvsVaultPendingRewardWei;
