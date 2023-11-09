import { ContractTransaction } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contracts';

export type CreateProposalInput = {
  targets: string[];
  values: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
};

export type CreateProposalOutput = ContractTransaction;

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
}): Promise<CreateProposalOutput> =>
  governorBravoDelegateContract.propose(
    targets,
    values,
    signatures,
    callDatas,
    description,
    proposalType,
  );

export default createProposal;
