import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { XvsVault } from 'types/contracts';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = ContractReceipt;

const setVoteDelegate = async ({ xvsVaultContract, delegateAddress }: SetVoteDelegateInput) => {
  const transaction = await xvsVaultContract.delegate(delegateAddress);
  const receipt = await transaction.wait(1);
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default setVoteDelegate;
