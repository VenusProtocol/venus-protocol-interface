import BigNumber from 'bignumber.js';
import { VrtVault } from 'types/contracts';

export interface IGetVrtVaultInterestRatePerBlockInput {
  vrtVaultContract: VrtVault;
}

export type GetVrtVaultInterestRatePerBlockOutput = BigNumber;

const getVrtVaultInterestRatePerBlock = async ({
  vrtVaultContract,
}: IGetVrtVaultInterestRatePerBlockInput): Promise<GetVrtVaultInterestRatePerBlockOutput> => {
  const res = await vrtVaultContract.methods.interestRatePerBlock().call();
  return new BigNumber(res);
};

export default getVrtVaultInterestRatePerBlock;
