import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface GetXvsVaultPendingRewardInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultPendingRewardOutput = {
  pendingXvsReward: BigNumber;
};

const getXvsVaultPendingReward = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultPendingRewardInput): Promise<GetXvsVaultPendingRewardOutput> => {
  const res = await xvsVaultContract.pendingReward(rewardTokenAddress, poolIndex, accountAddress);
  return {
    pendingXvsReward: new BigNumber(res.toString()),
  };
};

export default getXvsVaultPendingReward;
