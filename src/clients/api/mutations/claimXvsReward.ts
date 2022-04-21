import type { TransactionReceipt } from 'web3-core/types';

import { Comptroller } from 'types/contracts';

export interface IClaimXvsRewardInput {
  comptrollerContract: Comptroller;
  fromAccountAddress: string;
  tokenAddresses: string[];
}

export type ClaimXvsRewardOutput = TransactionReceipt;

const claimXvsReward = async ({
  comptrollerContract,
  fromAccountAddress,
  tokenAddresses,
}: IClaimXvsRewardInput): Promise<ClaimXvsRewardOutput> =>
  comptrollerContract.methods['claimVenus(address,address[])'](
    fromAccountAddress,
    tokenAddresses,
  ).send({
    from: fromAccountAddress,
  });

export default claimXvsReward;
