import BigNumber from 'bignumber.js';
import { VrtVault } from 'types/contracts';

export interface IGetVrtVaultAccruedInterestWeiInput {
  vrtVaultContract: VrtVault;
  accountAddress: string;
}

export type GetVrtVaultAccruedInterestWeiOutput = BigNumber;

const getVrtVaultAccruedInterestWei = async ({
  vrtVaultContract,
  accountAddress,
}: IGetVrtVaultAccruedInterestWeiInput): Promise<GetVrtVaultAccruedInterestWeiOutput> => {
  const response = await vrtVaultContract.methods.getAccruedInterest(accountAddress).call();
  return new BigNumber(response);
};

export default getVrtVaultAccruedInterestWei;
