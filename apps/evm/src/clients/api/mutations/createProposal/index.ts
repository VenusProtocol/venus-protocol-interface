import type { GovernorBravoDelegate } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export type CreateProposalInput = {
  targets: string[];
  values: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
  proposalType: 0 | 1 | 2;
};

export type CreateProposalOutput = LooseEthersContractTxData;

const createProposal = ({
  governorBravoDelegateContract,
  targets,
  values,
  signatures,
  callDatas,
  description,
  proposalType,
}: CreateProposalInput & {
  governorBravoDelegateContract: GovernorBravoDelegate;
}): CreateProposalOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'propose',
  args: [targets, values, signatures, callDatas, description, proposalType],
});

export default createProposal;
