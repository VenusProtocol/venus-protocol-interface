import type { TransactionReceipt } from 'web3-core/types';

import { VaiVault } from 'types/contracts';

export interface ClaimVaiVaultRewardInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
}

export type ClaimVaiVaultRewardOutput = TransactionReceipt;

const claimVaiVaultReward = async ({
  vaiVaultContract,
  fromAccountAddress,
}: ClaimVaiVaultRewardInput): Promise<ClaimVaiVaultRewardOutput> => {
  const resp = await vaiVaultContract.methods.claim().send({ from: fromAccountAddress });
  return resp;
};

export default claimVaiVaultReward;
