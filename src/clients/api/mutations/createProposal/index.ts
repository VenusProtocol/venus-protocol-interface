import { ContractReceipt } from 'ethers';

import { GovernorBravoDelegate } from 'types/contracts';

export interface CreateProposalInput {
  targets: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
}

export type CreateProposalOutput = ContractReceipt;

const createProposal = async ({
  governorBravoContract,
  targets,
  signatures,
  callDatas,
  description,
  proposalType,
}: CreateProposalInput & {
  governorBravoContract: GovernorBravoDelegate;
}): Promise<CreateProposalOutput> => {
  const transaction = await governorBravoContract.propose(
    targets,
    Array(signatures.length).fill(0),
    signatures,
    callDatas,
    description,
    proposalType,
  );
  return transaction.wait(1);
};

export default createProposal;
