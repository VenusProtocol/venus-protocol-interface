import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolInfosInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  pid: number;
}

export type GetXvsVaultPoolInfosOutput = {
  tokenAddress: string;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
};

const getXvsVaultPoolInfos = async ({
  xvsVaultContract,
  tokenAddress,
  pid,
}: IGetXvsVaultPoolInfosInput): Promise<GetXvsVaultPoolInfosOutput> => {
  const res = await xvsVaultContract.methods.poolInfos(tokenAddress, pid).call();

  return {
    tokenAddress: res.token,
    allocationPoint: +res.allocPoint,
    lastRewardBlock: +res.lastRewardBlock,
    accRewardPerShare: new BigNumber(res.accRewardPerShare),
    // Convert lockPeriod from seconds to milliseconds
    lockingPeriodMs: +res.lockPeriod * 1000,
  };
};

export default getXvsVaultPoolInfos;
