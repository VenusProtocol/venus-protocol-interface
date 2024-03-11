import type { GovernorBravoDelegate } from 'libs/contracts';

export interface GetProposalStateInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: string;
}

export type GetProposalStateOutput = {
  state: number;
};

const getProposalState = async ({
  governorBravoDelegateContract,
  proposalId,
}: GetProposalStateInput): Promise<GetProposalStateOutput> => {
  const state = await governorBravoDelegateContract.state(proposalId);

  return { state };
};

export default getProposalState;
