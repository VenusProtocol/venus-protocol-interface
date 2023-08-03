import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface SetVoteDelegateInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = ContractReceipt;

const setVoteDelegate = async ({ xvsVaultContract, delegateAddress }: SetVoteDelegateInput) => {
  const transaction = await xvsVaultContract.delegate(delegateAddress);
  const receipt = await transaction.wait(1);
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default setVoteDelegate;
