import type { TransactionReceipt } from 'web3-core';

import { XvsVault } from 'types/contracts';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
  delegateAddress: string;
}

export type SetVoteDelegateOutput = TransactionReceipt;

const setVoteDelegate = async ({
  xvsVaultContract,
  accountAddress,
  delegateAddress,
}: SetVoteDelegateInput) =>
  xvsVaultContract.methods.delegate(delegateAddress).send({ from: accountAddress });

export default setVoteDelegate;
