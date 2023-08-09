import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface CreateProposalInput {
  targets: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
}

export type CreateProposalOutput = ContractReceipt;

const createProposal = async ({
  governorBravoDelegateContract,
  targets,
  signatures,
  callDatas,
  description,
  proposalType,
}: CreateProposalInput & {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
}): Promise<CreateProposalOutput> => {
  const transaction = await governorBravoDelegateContract.propose(
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
