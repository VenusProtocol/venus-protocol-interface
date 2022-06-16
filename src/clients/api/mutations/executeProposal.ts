import type { TransactionReceipt } from 'web3-core';
import { GovernorBravoDelegate } from 'types/contracts';

export interface IExecuteProposalInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
  proposalId: number;
}

export type ExecuteProposalOutput = TransactionReceipt;

const executeProposal = async ({
  governorBravoContract,
  accountAddress,
  proposalId,
}: IExecuteProposalInput): Promise<ExecuteProposalOutput> =>
  governorBravoContract.methods.execute(proposalId).send({ from: accountAddress });

export default executeProposal;
