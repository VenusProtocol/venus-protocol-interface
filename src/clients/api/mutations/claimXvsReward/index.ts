import { checkForComptrollerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

export interface ClaimXvsRewardInput {
  comptrollerContract: Comptroller;
  fromAccountAddress: string;
}

export type ClaimXvsRewardOutput = TransactionReceipt;

const claimXvsReward = async ({
  comptrollerContract,
  fromAccountAddress,
}: ClaimXvsRewardInput): Promise<ClaimXvsRewardOutput> => {
  // Fetch list of tokens for which user have a positive balance, since these
  // are the tokens susceptible to have generated XVS rewards
  const vTokenAddresses = Object.values(VBEP_TOKENS).map(vToken => vToken.address);
  // TODO [VEN-198] - use venus lens to fetch rewards by addresses once it is upgraded with this functionality
  // Send query to claim XVS reward
  const resp = await comptrollerContract.methods['claimVenus(address,address[])'](
    fromAccountAddress,
    vTokenAddresses,
  ).send({
    from: fromAccountAddress,
  });
  return checkForComptrollerTransactionError(resp);
};

export default claimXvsReward;
