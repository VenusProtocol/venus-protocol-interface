import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { XvsVault } from 'packages/contracts';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = ContractReceipt;

const setVoteDelegate = async ({ xvsVaultContract, delegateAddress }: SetVoteDelegateInput) => {
  const transaction = await xvsVaultContract.delegate(delegateAddress);
  const receipt = await transaction.wait(1);
  // TODO: remove check once this function has been refactored to use useSendTransaction hook
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default setVoteDelegate;
