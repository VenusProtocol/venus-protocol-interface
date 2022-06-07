import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolInfosInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  poolIndex: number;
}

export type GetXvsVaultPoolInfosOutput = {
  stakedTokenAddress: string;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
};

const getXvsVaultPoolInfos = async ({
  xvsVaultContract,
  tokenAddress,
  poolIndex,
}: IGetXvsVaultPoolInfosInput): Promise<GetXvsVaultPoolInfosOutput> => {
  const res = await xvsVaultContract.methods.poolInfos(tokenAddress, poolIndex).call();

  return {
    stakedTokenAddress: res.token,
    allocationPoint: +res.allocPoint,
    lastRewardBlock: +res.lastRewardBlock,
    accRewardPerShare: new BigNumber(res.accRewardPerShare),
    // Convert lockPeriod from seconds to milliseconds
    lockingPeriodMs: +res.lockPeriod * 1000,
  };
};

export default getXvsVaultPoolInfos;
