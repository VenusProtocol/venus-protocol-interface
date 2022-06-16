import type { TransactionReceipt } from 'web3-core/types';

import { VrtVault } from 'types/contracts';

export interface IClaimVrtVaultRewardInput {
  vrtVaultContract: VrtVault;
  fromAccountAddress: string;
}

export type ClaimVrtVaultRewardOutput = TransactionReceipt;

const claimVrtVaultReward = async ({
  vrtVaultContract,
  fromAccountAddress,
}: IClaimVrtVaultRewardInput): Promise<ClaimVrtVaultRewardOutput> => {
  const resp = await vrtVaultContract.methods.claim().send({ from: fromAccountAddress });
  // VRT vault proxy contract always throws in case of an error so there's no
  // need to check for errors in transaction receipt
  return resp;
};

export default claimVrtVaultReward;
