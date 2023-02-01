import { GovernorBravoDelegate } from 'types/contracts';

export interface GetProposalStateInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: string;
}

export type GetProposalStateOutput = {
  state: number;
};

const getProposalState = async ({
  governorBravoContract,
  proposalId,
}: GetProposalStateInput): Promise<GetProposalStateOutput> => {
  const state = await governorBravoContract.state(proposalId);

  return { state };
};

export default getProposalState;
