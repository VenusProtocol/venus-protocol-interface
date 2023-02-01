import { checkForComptrollerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

export interface ClaimXvsRewardInput {
  comptrollerContract: Comptroller;
}

export type ClaimXvsRewardOutput = ContractReceipt;

const claimXvsReward = async ({
  comptrollerContract,
}: ClaimXvsRewardInput): Promise<ClaimXvsRewardOutput> => {
  const accountAddress = await comptrollerContract.signer.getAddress();
  // Fetch list of tokens for which user have a positive balance, since these
  // are the tokens susceptible to have generated XVS rewards
  const vTokenAddresses = Object.values(VBEP_TOKENS).map(vToken => vToken.address);

  const transaction = await comptrollerContract['claimVenus(address,address[])'](
    accountAddress,
    vTokenAddresses,
  );
  const receipt = await transaction.wait(1);
  return checkForComptrollerTransactionError(receipt);
};

export default claimXvsReward;
