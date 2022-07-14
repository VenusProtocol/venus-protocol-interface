import formatToPoolInfo from './formatToPoolInfo';
import { IGetXvsVaultPoolInfoInput, IGetXvsVaultPoolInfoOutput } from './types';

export * from './types';

const getXvsVaultPoolInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: IGetXvsVaultPoolInfoInput): Promise<IGetXvsVaultPoolInfoOutput> => {
  const res = await xvsVaultContract.methods.poolInfos(rewardTokenAddress, poolIndex).call();
  return formatToPoolInfo(res);
};

export default getXvsVaultPoolInfo;
