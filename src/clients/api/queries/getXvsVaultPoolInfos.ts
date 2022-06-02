import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolInfosInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  pid: number;
}

export type GetXvsVaultPoolInfosOutput = {
  tokenAddress: string;
  allocPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockPeriodDays: number;
};

const getXvsVaultPoolInfos = async ({
  xvsVaultContract,
  tokenAddress,
  pid,
}: IGetXvsVaultPoolInfosInput): Promise<GetXvsVaultPoolInfosOutput> => {
  const res = await xvsVaultContract.methods.poolInfos(tokenAddress, pid).call();

  return {
    tokenAddress: res.token,
    allocPoint: +res.allocPoint,
    lastRewardBlock: +res.lastRewardBlock,
    accRewardPerShare: new BigNumber(res.accRewardPerShare),
    lockPeriodDays: +res.lockPeriod,
  };
};

export default getXvsVaultPoolInfos;
