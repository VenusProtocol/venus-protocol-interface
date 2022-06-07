import { getToken } from 'utilities';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolsCountInput {
  xvsVaultContract: XvsVault;
}

export type GetXvsVaultPoolsCountOutput = number;

const getXvsVaultPoolsCount = async ({
  xvsVaultContract,
}: IGetXvsVaultPoolsCountInput): Promise<GetXvsVaultPoolsCountOutput> => {
  const xvsTokenAddress = getToken('xvs').address;
  const xvsVaultPoolLength = await xvsVaultContract.methods.poolLength(xvsTokenAddress).call();
  return +xvsVaultPoolLength;
};

export default getXvsVaultPoolsCount;
