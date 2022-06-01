import { getToken } from 'utilities';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolLengthInput {
  xvsVaultContract: XvsVault;
}

export type GetXvsVaultPoolLengthOutput = number;

const getXvsVaultPoolLength = async ({
  xvsVaultContract,
}: IGetXvsVaultPoolLengthInput): Promise<GetXvsVaultPoolLengthOutput> => {
  const xvsTokenAddress = getToken('xvs').address;
  const xvsVaultPoolLength = await xvsVaultContract.methods.poolLength(xvsTokenAddress).call();
  return +xvsVaultPoolLength;
};

export default getXvsVaultPoolLength;
