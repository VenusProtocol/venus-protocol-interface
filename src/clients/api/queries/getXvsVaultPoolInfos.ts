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
  lockingPeriodDays: number;
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
    lockingPeriodDays: +res.lockPeriod,
  };
};

export default getXvsVaultPoolInfos;
