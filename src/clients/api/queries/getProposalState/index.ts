import { GovernorBravoDelegate } from 'types/contracts';

export interface GetProposalStateInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: string;
}

export type GetProposalStateOutput = string;

const getProposalState = async ({
  governorBravoContract,
  proposalId,
}: GetProposalStateInput): Promise<GetProposalStateOutput> =>
  governorBravoContract.methods.state(proposalId).call();

export default getProposalState;
