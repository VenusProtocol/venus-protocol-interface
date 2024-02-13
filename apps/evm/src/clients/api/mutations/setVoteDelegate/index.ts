import { ContractReceipt } from 'ethers';

import { XvsVault } from 'libs/contracts';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = ContractReceipt;

const setVoteDelegate = async ({ xvsVaultContract, delegateAddress }: SetVoteDelegateInput) =>
  xvsVaultContract.delegate(delegateAddress);

export default setVoteDelegate;
