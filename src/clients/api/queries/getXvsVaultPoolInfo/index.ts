import { IGetXvsVaultPoolInfoInput, IGetXvsVaultPoolInfoOutput } from './types';
import formatToPoolInfo from './formatToPoolInfo';

export * from './types';

const getXvsVaultPoolInfo = async ({
  xvsVaultContract,
  tokenAddress,
  poolIndex,
}: IGetXvsVaultPoolInfoInput): Promise<IGetXvsVaultPoolInfoOutput> => {
  const res = await xvsVaultContract.methods.poolInfos(tokenAddress, poolIndex).call();
  return formatToPoolInfo(res);
};

export default getXvsVaultPoolInfo;
