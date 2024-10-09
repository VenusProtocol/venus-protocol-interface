import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData } from 'types';

export type CreateProposalInput = {
  targets: string[];
  values: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
};

export type CreateProposalOutput = ContractTxData<GovernorBravoDelegate, 'propose'>;

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
}): Promise<CreateProposalOutput> => ({
  contract: governorBravoDelegateContract,
  methodName: 'propose',
  args: [targets, values, signatures, callDatas, description, proposalType],
});

export default createProposal;
