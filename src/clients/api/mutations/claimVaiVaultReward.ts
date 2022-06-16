import type { TransactionReceipt } from 'web3-core/types';

import { VaiVault } from 'types/contracts';

export interface IClaimVaiVaultRewardInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
}

export type ClaimVaiVaultRewardOutput = TransactionReceipt;

const claimVaiVaultReward = async ({
  vaiVaultContract,
  fromAccountAddress,
}: IClaimVaiVaultRewardInput): Promise<ClaimVaiVaultRewardOutput> => {
  const resp = await vaiVaultContract.methods.claim().send({ from: fromAccountAddress });
  return resp;
};

export default claimVaiVaultReward;
