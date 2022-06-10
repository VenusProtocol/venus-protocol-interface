import { GovernorBravoDelegate } from 'types/contracts';

export interface IGetProposalStateInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: string;
}

export type GetProposalStateOutput = string;

const getProposalState = async ({
  governorBravoContract,
  proposalId,
}: IGetProposalStateInput): Promise<GetProposalStateOutput> =>
  governorBravoContract.methods.state(proposalId).call();

export default getProposalState;
