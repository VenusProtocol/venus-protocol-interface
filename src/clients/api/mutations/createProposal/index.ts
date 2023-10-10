import { ContractReceipt } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contracts';

export interface CreateProposalInput {
  targets: string[];
  values: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
}

export type CreateProposalOutput = ContractReceipt;

const createProposal = async ({
  governorBravoDelegateContract,
  targets,
  values,
  signatures,
  callDatas,
  description,
  proposalType,
}: CreateProposalInput & {
  governorBravoDelegateContract: GovernorBravoDelegate;
}): Promise<CreateProposalOutput> => {
  const transaction = await governorBravoDelegateContract.propose(
    targets,
    values,
    signatures,
    callDatas,
    description,
    proposalType,
  );
  return transaction.wait(1);
};

export default createProposal;
