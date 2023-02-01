import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

export interface GetVrtVaultInterestRatePerBlockInput {
  vrtVaultContract: VrtVault;
}

export type GetVrtVaultInterestRatePerBlockOutput = {
  interestRatePerBlockWei: BigNumber;
};

const getVrtVaultInterestRatePerBlock = async ({
  vrtVaultContract,
}: GetVrtVaultInterestRatePerBlockInput): Promise<GetVrtVaultInterestRatePerBlockOutput> => {
  const res = await vrtVaultContract.interestRatePerBlock();

  return {
    interestRatePerBlockWei: new BigNumber(res.toString()),
  };
};

export default getVrtVaultInterestRatePerBlock;
