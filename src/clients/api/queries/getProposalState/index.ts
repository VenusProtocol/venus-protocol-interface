import { GovernorBravoDelegate } from 'types/contracts';

export interface GetProposalStateInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: string;
}

export type GetProposalStateOutput = {
  state: string;
};

const getProposalState = async ({
  governorBravoContract,
  proposalId,
}: GetProposalStateInput): Promise<GetProposalStateOutput> => {
  const state = await governorBravoContract.methods.state(proposalId).call();

  return { state };
};

export default getProposalState;
