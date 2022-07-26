import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

export interface GetVrtVaultAccruedInterestInput {
  vrtVaultContract: VrtVault;
  accountAddress: string;
}

export type GetVrtVaultAccruedInterestOutput = {
  accruedInterestWei: BigNumber;
};

const getVrtVaultAccruedInterest = async ({
  vrtVaultContract,
  accountAddress,
}: GetVrtVaultAccruedInterestInput): Promise<GetVrtVaultAccruedInterestOutput> => {
  const response = await vrtVaultContract.methods.getAccruedInterest(accountAddress).call();

  return {
    accruedInterestWei: new BigNumber(response),
  };
};

export default getVrtVaultAccruedInterest;
