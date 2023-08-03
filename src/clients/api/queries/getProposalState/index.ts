import { ContractTypeByName } from 'packages/contracts';

export interface GetProposalStateInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
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
