import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

export interface GetVrtVaultInterestRatePerBlockInput {
  vrtVaultContract: VrtVault;
}

export type GetVrtVaultInterestRatePerBlockOutput = BigNumber;

const getVrtVaultInterestRatePerBlock = async ({
  vrtVaultContract,
}: GetVrtVaultInterestRatePerBlockInput): Promise<GetVrtVaultInterestRatePerBlockOutput> => {
  const res = await vrtVaultContract.methods.interestRatePerBlock().call();
  return new BigNumber(res);
};

export default getVrtVaultInterestRatePerBlock;
